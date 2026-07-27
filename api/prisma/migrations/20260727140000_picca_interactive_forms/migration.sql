-- Clean up partial state from a failed prior apply (idempotent)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `picca_interactive_entries`;
DROP TABLE IF EXISTS `picca_interactive_session_forms`;
DROP TABLE IF EXISTS `picca_interactive_sessions`;
DROP TABLE IF EXISTS `picca_interactive_forms`;
SET FOREIGN_KEY_CHECKS = 1;

-- CreateTable
CREATE TABLE `picca_interactive_forms` (
    `id` VARCHAR(64) NOT NULL,
    `kind` ENUM('daily_sono', 'weekly_estrategias') NOT NULL,
    `sort_order` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picca_interactive_sessions` (
    `id` CHAR(36) NOT NULL,
    `patient_id` VARCHAR(191) NOT NULL,
    `therapist_id` VARCHAR(191) NOT NULL,
    `token_hash` VARCHAR(64) NOT NULL,
    `patient_token` VARCHAR(64) NULL,
    `status` ENUM('active', 'in_progress', 'revoked') NOT NULL DEFAULT 'active',
    `consent_at` DATETIME(3) NULL,
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `picca_interactive_sessions_token_hash_key`(`token_hash`),
    INDEX `picca_interactive_sessions_therapist_id_idx`(`therapist_id`),
    INDEX `picca_interactive_sessions_patient_id_idx`(`patient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picca_interactive_session_forms` (
    `id` CHAR(36) NOT NULL,
    `session_id` CHAR(36) NOT NULL,
    `form_id` VARCHAR(64) NOT NULL,
    `sort_order` INTEGER NOT NULL,

    INDEX `picca_interactive_session_forms_session_id_idx`(`session_id`),
    UNIQUE INDEX `picca_interactive_session_forms_session_id_form_id_key`(`session_id`, `form_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picca_interactive_entries` (
    `id` CHAR(36) NOT NULL,
    `session_id` CHAR(36) NOT NULL,
    `form_id` VARCHAR(64) NOT NULL,
    `period_key` VARCHAR(10) NOT NULL,
    `answers_json` JSON NOT NULL,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `picca_interactive_entries_session_id_form_id_idx`(`session_id`, `form_id`),
    UNIQUE INDEX `picca_interactive_entries_session_id_form_id_period_key_key`(`session_id`, `form_id`, `period_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `picca_interactive_sessions` ADD CONSTRAINT `picca_interactive_sessions_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_interactive_sessions` ADD CONSTRAINT `picca_interactive_sessions_therapist_id_fkey` FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_interactive_session_forms` ADD CONSTRAINT `picca_interactive_session_forms_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `picca_interactive_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_interactive_session_forms` ADD CONSTRAINT `picca_interactive_session_forms_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `picca_interactive_forms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_interactive_entries` ADD CONSTRAINT `picca_interactive_entries_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `picca_interactive_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_interactive_entries` ADD CONSTRAINT `picca_interactive_entries_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `picca_interactive_forms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT IGNORE INTO `picca_interactive_forms` (`id`, `kind`, `sort_order`, `title`, `description`, `active`, `updated_at`) VALUES
('picca-interactive-sono', 'daily_sono', 1, 'Rituais do Sono', 'Avaliação diária das estratégias de sono — registo por dia da semana corrente.', true, CURRENT_TIMESTAMP(3)),
('picca-interactive-estrategias', 'weekly_estrategias', 2, 'Estratégias e Tabelas', 'Mapa de corresponsabilização parental e rotinas — registo semanal (segunda a domingo).', true, CURRENT_TIMESTAMP(3));
