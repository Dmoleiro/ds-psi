-- CreateTable
CREATE TABLE `locations` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Default location for existing patients
INSERT INTO `locations` (`id`, `name`, `active`, `updated_at`)
VALUES ('00000000-0000-4000-8000-000000000001', 'Local principal', true, CURRENT_TIMESTAMP(3));

-- AlterTable
ALTER TABLE `patients` ADD COLUMN `location_id` VARCHAR(191) NULL;

UPDATE `patients` SET `location_id` = '00000000-0000-4000-8000-000000000001' WHERE `location_id` IS NULL;

ALTER TABLE `patients` MODIFY `location_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `patients_location_id_idx` ON `patients`(`location_id`);

-- AddForeignKey
ALTER TABLE `patients` ADD CONSTRAINT `patients_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
