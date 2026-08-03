-- AlterTable
ALTER TABLE `users` ADD COLUMN `google_calendar_sync_allowed` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `appointments`
    ADD COLUMN `google_calendar_id` VARCHAR(191) NULL,
    ADD COLUMN `google_event_id` VARCHAR(191) NULL,
    ADD COLUMN `google_sync_status` ENUM('not_linked', 'pending', 'synced', 'failed') NOT NULL DEFAULT 'not_linked',
    ADD COLUMN `google_synced_at` DATETIME(3) NULL,
    ADD COLUMN `google_sync_error` TEXT NULL;

-- CreateIndex
CREATE INDEX `appointments_google_sync_status_idx` ON `appointments`(`google_sync_status`);

-- CreateTable
CREATE TABLE `google_calendar_connections` (
    `id` VARCHAR(191) NOT NULL,
    `therapist_id` VARCHAR(191) NOT NULL,
    `google_email` VARCHAR(191) NOT NULL,
    `calendar_id` VARCHAR(191) NOT NULL,
    `calendar_name` VARCHAR(191) NULL,
    `access_token` TEXT NOT NULL,
    `refresh_token` TEXT NOT NULL,
    `token_expires_at` DATETIME(3) NOT NULL,
    `scopes` TEXT NOT NULL,
    `sync_enabled` BOOLEAN NOT NULL DEFAULT true,
    `send_invites` BOOLEAN NOT NULL DEFAULT true,
    `invite_recipients` VARCHAR(191) NOT NULL DEFAULT 'email',
    `connected_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `google_calendar_connections_therapist_id_key`(`therapist_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `google_calendar_connections` ADD CONSTRAINT `google_calendar_connections_therapist_id_fkey` FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
