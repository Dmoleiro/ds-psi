-- Fix coordinator_therapists for MySQL index length limits (local dev with composite PK).
-- No-op when the table was created with the corrected migration or does not exist yet.

SET @table_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'coordinator_therapists'
);

SET @has_id_column := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'coordinator_therapists'
    AND COLUMN_NAME = 'id'
);

SET @sql := IF(
  @table_exists > 0 AND @has_id_column = 0,
  'ALTER TABLE `coordinator_therapists` ADD COLUMN `id` VARCHAR(191) NULL',
  'SELECT ''coordinator_therapists.id already exists or table missing'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
  @table_exists > 0 AND @has_id_column = 0,
  'UPDATE `coordinator_therapists` SET `id` = UUID() WHERE `id` IS NULL',
  'SELECT ''skip coordinator_therapists id backfill'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
  @table_exists > 0 AND @has_id_column = 0,
  'ALTER TABLE `coordinator_therapists` MODIFY `id` VARCHAR(191) NOT NULL',
  'SELECT ''skip coordinator_therapists id not null'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
  @table_exists > 0 AND @has_id_column = 0,
  'ALTER TABLE `coordinator_therapists` DROP PRIMARY KEY',
  'SELECT ''skip coordinator_therapists drop primary key'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := IF(
  @table_exists > 0 AND @has_id_column = 0,
  'ALTER TABLE `coordinator_therapists` ADD PRIMARY KEY (`id`)',
  'SELECT ''skip coordinator_therapists add primary key'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @unique_exists := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'coordinator_therapists'
    AND INDEX_NAME = 'coordinator_therapists_coordinator_id_therapist_id_key'
);

SET @sql := IF(
  @table_exists > 0 AND @unique_exists = 0,
  'CREATE UNIQUE INDEX `coordinator_therapists_coordinator_id_therapist_id_key` ON `coordinator_therapists`(`coordinator_id`(36), `therapist_id`(36))',
  'SELECT ''coordinator_therapists unique index already exists or table missing'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
