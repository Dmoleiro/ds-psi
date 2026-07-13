-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'therapist') NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `patients` (
    `id` VARCHAR(191) NOT NULL,
    `therapist_id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `birth_date` DATE NULL,
    `internal_notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `patients_therapist_id_idx`(`therapist_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `intake_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `patient_id` VARCHAR(191) NOT NULL,
    `therapist_id` VARCHAR(191) NOT NULL,
    `token_hash` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'in_progress', 'completed', 'revoked') NOT NULL DEFAULT 'active',
    `expires_at` DATETIME(3) NULL,
    `completed_at` DATETIME(3) NULL,
    `consent_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `intake_sessions_token_hash_key`(`token_hash`),
    INDEX `intake_sessions_therapist_id_idx`(`therapist_id`),
    INDEX `intake_sessions_patient_id_idx`(`patient_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `form_definitions` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `schema_json` JSON NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `session_forms` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `form_id` VARCHAR(191) NOT NULL,
    `status` ENUM('not_started', 'in_progress', 'submitted') NOT NULL DEFAULT 'not_started',
    `sort_order` INTEGER NOT NULL,

    INDEX `session_forms_session_id_idx`(`session_id`),
    UNIQUE INDEX `session_forms_session_id_form_id_key`(`session_id`, `form_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `form_drafts` (
    `session_form_id` VARCHAR(191) NOT NULL,
    `answers_json` JSON NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`session_form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `form_submissions` (
    `session_form_id` VARCHAR(191) NOT NULL,
    `answers_json` JSON NOT NULL,
    `submitted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ip` VARCHAR(191) NULL,

    PRIMARY KEY (`session_form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `patients` ADD CONSTRAINT `patients_therapist_id_fkey` FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `intake_sessions` ADD CONSTRAINT `intake_sessions_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `intake_sessions` ADD CONSTRAINT `intake_sessions_therapist_id_fkey` FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `session_forms` ADD CONSTRAINT `session_forms_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `intake_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `session_forms` ADD CONSTRAINT `session_forms_form_id_fkey` FOREIGN KEY (`form_id`) REFERENCES `form_definitions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `form_drafts` ADD CONSTRAINT `form_drafts_session_form_id_fkey` FOREIGN KEY (`session_form_id`) REFERENCES `session_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `form_submissions` ADD CONSTRAINT `form_submissions_session_form_id_fkey` FOREIGN KEY (`session_form_id`) REFERENCES `session_forms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
