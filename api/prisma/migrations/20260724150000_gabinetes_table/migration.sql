-- CreateTable
CREATE TABLE `gabinetes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `gabinetes` (`id`, `name`, `active`, `sort_order`, `updated_at`)
VALUES
    ('a1000000-0000-4000-8000-000000000001', 'Gabinete 1', true, 1, CURRENT_TIMESTAMP(3)),
    ('a1000000-0000-4000-8000-000000000002', 'Gabinete 2', true, 2, CURRENT_TIMESTAMP(3));

ALTER TABLE `appointments` ADD COLUMN `gabinete_id` VARCHAR(191) NULL;

UPDATE `appointments` SET `gabinete_id` = 'a1000000-0000-4000-8000-000000000001' WHERE `room` = 'gabinete_1';
UPDATE `appointments` SET `gabinete_id` = 'a1000000-0000-4000-8000-000000000002' WHERE `room` = 'gabinete_2';
UPDATE `appointments` SET `gabinete_id` = 'a1000000-0000-4000-8000-000000000001' WHERE `gabinete_id` IS NULL;

ALTER TABLE `appointments` MODIFY `gabinete_id` VARCHAR(191) NOT NULL;

DROP INDEX `appointments_room_scheduled_at_idx` ON `appointments`;
ALTER TABLE `appointments` DROP COLUMN `room`;

CREATE INDEX `appointments_gabinete_id_scheduled_at_idx` ON `appointments`(`gabinete_id`, `scheduled_at`);

ALTER TABLE `appointments` ADD CONSTRAINT `appointments_gabinete_id_fkey` FOREIGN KEY (`gabinete_id`) REFERENCES `gabinetes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
