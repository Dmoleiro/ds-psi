-- Drop whatever FK links intake_sessions.patient_id → patients (name varies on some hosts)
SET @fk_name = (
  SELECT CONSTRAINT_NAME
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'intake_sessions'
    AND COLUMN_NAME = 'patient_id'
    AND REFERENCED_TABLE_NAME = 'patients'
  LIMIT 1
);

SET @drop_sql = IF(
  @fk_name IS NOT NULL,
  CONCAT('ALTER TABLE `intake_sessions` DROP FOREIGN KEY `', @fk_name, '`'),
  'SELECT 1'
);
PREPARE drop_stmt FROM @drop_sql;
EXECUTE drop_stmt;
DEALLOCATE PREPARE drop_stmt;

-- Add CASCADE FK (skip if already present with correct name)
SET @has_fk = (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'intake_sessions'
    AND CONSTRAINT_NAME = 'intake_sessions_patient_id_fkey'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);

SET @add_sql = IF(
  @has_fk = 0,
  'ALTER TABLE `intake_sessions` ADD CONSTRAINT `intake_sessions_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  'SELECT 1'
);
PREPARE add_stmt FROM @add_sql;
EXECUTE add_stmt;
DEALLOCATE PREPARE add_stmt;
