-- AlterTable
ALTER TABLE `users` ADD COLUMN `picca_enabled` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `picca_modules` (
    `id` VARCHAR(191) NOT NULL,
    `volume` INTEGER NOT NULL,
    `module_number` INTEGER NOT NULL,
    `sort_order` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picca_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `patient_id` VARCHAR(191) NOT NULL,
    `therapist_id` VARCHAR(191) NOT NULL,
    `token_hash` VARCHAR(191) NOT NULL,
    `patient_token` VARCHAR(191) NULL,
    `status` ENUM('active', 'in_progress', 'revoked') NOT NULL DEFAULT 'active',
    `consent_at` DATETIME(3) NULL,
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `picca_sessions_token_hash_key`(`token_hash`),
    INDEX `picca_sessions_therapist_id_idx`(`therapist_id`),
    INDEX `picca_sessions_patient_id_idx`(`patient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picca_session_modules` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `module_id` VARCHAR(191) NOT NULL,
    `status` ENUM('not_started', 'in_progress', 'submitted') NOT NULL DEFAULT 'not_started',
    `sort_order` INTEGER NOT NULL,

    INDEX `picca_session_modules_session_id_idx`(`session_id`),
    UNIQUE INDEX `picca_session_modules_session_id_module_id_key`(`session_id`, `module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picca_module_drafts` (
    `session_module_id` VARCHAR(191) NOT NULL,
    `answers_json` JSON NOT NULL,
    `last_edited_by` ENUM('patient', 'therapist') NOT NULL DEFAULT 'patient',
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`session_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `picca_module_submissions` (
    `session_module_id` VARCHAR(191) NOT NULL,
    `answers_json` JSON NOT NULL,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `submitted_by` ENUM('patient', 'therapist') NOT NULL DEFAULT 'patient',
    `last_edited_at` DATETIME(3) NULL,
    `last_edited_by` ENUM('patient', 'therapist') NULL,

    PRIMARY KEY (`session_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `picca_sessions` ADD CONSTRAINT `picca_sessions_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_sessions` ADD CONSTRAINT `picca_sessions_therapist_id_fkey` FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_session_modules` ADD CONSTRAINT `picca_session_modules_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `picca_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_session_modules` ADD CONSTRAINT `picca_session_modules_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `picca_modules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_module_drafts` ADD CONSTRAINT `picca_module_drafts_session_module_id_fkey` FOREIGN KEY (`session_module_id`) REFERENCES `picca_session_modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `picca_module_submissions` ADD CONSTRAINT `picca_module_submissions_session_module_id_fkey` FOREIGN KEY (`session_module_id`) REFERENCES `picca_session_modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed PICCA modules (Volume I, modules 2–4)
INSERT INTO `picca_modules` (`id`, `volume`, `module_number`, `sort_order`, `title`, `description`, `active`, `updated_at`) VALUES
('picca-vol1-mod2', 1, 2, 2, 'História Familiar e Contexto Familiar', 'Recolha sistemática de informação sobre o contexto familiar, fatores predisponentes, protetores e acontecimentos relevantes.', true, CURRENT_TIMESTAMP(3)),
('picca-vol1-mod3', 1, 3, 3, 'Gestação, Parto e Período Neonatal', 'Fatores pré-natais, peri-natais e neonatais relevantes para a conceptualização clínica.', true, CURRENT_TIMESTAMP(3)),
('picca-vol1-mod4', 1, 4, 4, 'História do Desenvolvimento', 'Marcos do desenvolvimento, competências, sinais de alerta e áreas de vulnerabilidade.', true, CURRENT_TIMESTAMP(3));
