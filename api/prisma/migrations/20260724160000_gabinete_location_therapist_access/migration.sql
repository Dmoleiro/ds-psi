-- Assign each gabinete to a location (default: first active location)
ALTER TABLE `gabinetes` ADD COLUMN `location_id` VARCHAR(191) NULL;

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

ALTER TABLE `gabinetes` MODIFY `location_id` VARCHAR(191) NOT NULL;

CREATE INDEX `gabinetes_location_id_idx` ON `gabinetes`(`location_id`);

ALTER TABLE `gabinetes` ADD CONSTRAINT `gabinetes_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Therapist ↔ location access
CREATE TABLE `therapist_locations` (
    `id` VARCHAR(191) NOT NULL,
    `therapist_id` VARCHAR(191) NOT NULL,
    `location_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `therapist_locations_therapist_id_location_id_key`(`therapist_id`(36), `location_id`(36)),
    INDEX `therapist_locations_location_id_idx`(`location_id`),
    CONSTRAINT `therapist_locations_therapist_id_fkey` FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `therapist_locations_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Existing therapists keep access to all active locations
INSERT IGNORE INTO `therapist_locations` (`id`, `therapist_id`, `location_id`)
SELECT UUID(), `u`.`id`, `l`.`id`
FROM `users` `u`
CROSS JOIN `locations` `l`
WHERE `u`.`role` = 'therapist' AND `l`.`active` = 1;

-- Preserve access to locations where therapists already have patients
INSERT IGNORE INTO `therapist_locations` (`id`, `therapist_id`, `location_id`)
SELECT UUID(), `therapist_id`, `location_id` FROM `patients`;
