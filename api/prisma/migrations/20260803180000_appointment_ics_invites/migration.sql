-- AlterTable
ALTER TABLE `users`
    ADD COLUMN `appointment_invites_allowed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `appointment_invites_enabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `appointment_invite_recipients` VARCHAR(191) NOT NULL DEFAULT 'email',
    ADD COLUMN `appointment_invite_copy_to_therapist` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `appointments`
    ADD COLUMN `calendar_uid` VARCHAR(191) NULL,
    ADD COLUMN `calendar_sequence` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `calendar_invite_status` ENUM('not_sent', 'pending', 'sent', 'failed', 'cancelled') NOT NULL DEFAULT 'not_sent',
    ADD COLUMN `calendar_invited_at` DATETIME(3) NULL,
    ADD COLUMN `calendar_invite_error` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `appointments_calendar_uid_key` ON `appointments`(`calendar_uid`);

-- CreateIndex
CREATE INDEX `appointments_calendar_invite_status_idx` ON `appointments`(`calendar_invite_status`);
