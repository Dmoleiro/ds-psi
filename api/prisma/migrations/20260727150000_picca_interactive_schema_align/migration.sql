-- Shorten indexed columns so composite unique keys fit utf8mb4 limits (max 1000 bytes).
-- Safe to run after a fresh 20260727140000 apply (no-op) or on DBs that applied the original migration.

ALTER TABLE `picca_interactive_forms` MODIFY COLUMN `id` VARCHAR(64) NOT NULL;

ALTER TABLE `picca_interactive_sessions`
    MODIFY COLUMN `id` CHAR(36) NOT NULL,
    MODIFY COLUMN `token_hash` VARCHAR(64) NOT NULL,
    MODIFY COLUMN `patient_token` VARCHAR(64) NULL;

ALTER TABLE `picca_interactive_session_forms`
    MODIFY COLUMN `id` CHAR(36) NOT NULL,
    MODIFY COLUMN `session_id` CHAR(36) NOT NULL,
    MODIFY COLUMN `form_id` VARCHAR(64) NOT NULL;

ALTER TABLE `picca_interactive_entries`
    MODIFY COLUMN `id` CHAR(36) NOT NULL,
    MODIFY COLUMN `session_id` CHAR(36) NOT NULL,
    MODIFY COLUMN `form_id` VARCHAR(64) NOT NULL,
    MODIFY COLUMN `period_key` VARCHAR(10) NOT NULL;
