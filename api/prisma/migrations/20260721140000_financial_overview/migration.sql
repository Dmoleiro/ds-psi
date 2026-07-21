-- Financial overview: therapist access flag, appointment fees, financial settings
ALTER TABLE `users` ADD COLUMN `financial_overview_enabled` BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE `appointments` ADD COLUMN `session_fee` DECIMAL(10, 2) NOT NULL DEFAULT 50;

UPDATE `appointments` SET `session_fee` = 50 WHERE `session_fee` IS NULL;

CREATE TABLE `therapist_financial_settings` (
    `id` VARCHAR(191) NOT NULL,
    `therapist_id` VARCHAR(191) NOT NULL,
    `social_security_rate` DECIMAL(6, 4) NOT NULL DEFAULT 0.15,
    `irs_rate` DECIMAL(6, 4) NOT NULL DEFAULT 0.20,
    `savings_rate` DECIMAL(6, 4) NOT NULL DEFAULT 0.10,
    `default_session_fee` DECIMAL(10, 2) NOT NULL DEFAULT 50,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `therapist_financial_settings_therapist_id_key`(`therapist_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `therapist_financial_settings` ADD CONSTRAINT `therapist_financial_settings_therapist_id_fkey` FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
