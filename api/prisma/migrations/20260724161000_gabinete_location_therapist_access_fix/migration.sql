-- Idempotent fix for production where 20260724160000 may have partially applied.
-- Safe to re-run.

SET @has_location_id := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'gabinetes'
    AND COLUMN_NAME = 'location_id'
);

SET @sql := IF(
  @has_location_id = 0,
  'ALTER TABLE `gabinetes` ADD COLUMN `location_id` VARCHAR(191) NULL',
  'SELECT ''gabinetes.location_id already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE `gabinetes` AS `g`
INNER JOIN (
  SELECT `id`
  FROM `locations`
  WHERE `active` = 1
  ORDER BY `name` ASC
  LIMIT 1
) AS `default_location` ON 1 = 1
SET `g`.`location_id` = `default_location`.`id`
WHERE `g`.`location_id` IS NULL;

UPDATE `gabinetes` AS `g`
INNER JOIN (
  SELECT `id`
  FROM `locations`
  ORDER BY `created_at` ASC
  LIMIT 1
) AS `any_location` ON 1 = 1
SET `g`.`location_id` = `any_location`.`id`
WHERE `g`.`location_id` IS NULL;

SET @null_gabinetes := (
  SELECT COUNT(*) FROM `gabinetes` WHERE `location_id` IS NULL
);

SET @sql := IF(
  @null_gabinetes = 0,
  'ALTER TABLE `gabinetes` MODIFY `location_id` VARCHAR(191) NOT NULL',
  'SELECT ''skipped NOT NULL: create a location first'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_location_idx := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'gabinetes'
    AND INDEX_NAME = 'gabinetes_location_id_idx'
);

SET @sql := IF(
  @has_location_idx = 0 AND @null_gabinetes = 0,
  'CREATE INDEX `gabinetes_location_id_idx` ON `gabinetes`(`location_id`)',
  'SELECT ''gabinetes_location_id_idx already exists or skipped'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_location_fk := (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'gabinetes'
    AND CONSTRAINT_NAME = 'gabinetes_location_id_fkey'
);

SET @sql := IF(
  @has_location_fk = 0 AND @null_gabinetes = 0,
  'ALTER TABLE `gabinetes` ADD CONSTRAINT `gabinetes_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE',
  'SELECT ''gabinetes_location_id_fkey already exists or skipped'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_therapist_locations := (
  SELECT COUNT(*)
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'therapist_locations'
);

SET @sql := IF(
  @has_therapist_locations = 0,
  'CREATE TABLE `therapist_locations` (
    `id` VARCHAR(191) NOT NULL,
    `therapist_id` VARCHAR(191) NOT NULL,
    `location_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE INDEX `therapist_locations_therapist_id_location_id_key`(`therapist_id`(36), `location_id`(36)),
    INDEX `therapist_locations_location_id_idx`(`location_id`),
    CONSTRAINT `therapist_locations_therapist_id_fkey` FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `therapist_locations_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
  'SELECT ''therapist_locations already exists'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

INSERT IGNORE INTO `therapist_locations` (`id`, `therapist_id`, `location_id`)
SELECT UUID(), `u`.`id`, `l`.`id`
FROM `users` `u`
CROSS JOIN `locations` `l`
WHERE `u`.`role` = 'therapist' AND `l`.`active` = 1;

INSERT IGNORE INTO `therapist_locations` (`id`, `therapist_id`, `location_id`)
SELECT UUID(), `therapist_id`, `location_id` FROM `patients`;
