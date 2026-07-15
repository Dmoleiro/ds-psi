-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `location_id` VARCHAR(191) NULL;

-- Backfill from patient default location
UPDATE `appointments` a
INNER JOIN `patients` p ON a.patient_id = p.id
SET a.location_id = p.location_id;

ALTER TABLE `appointments` MODIFY `location_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `appointments_location_id_scheduled_at_idx` ON `appointments`(`location_id`, `scheduled_at`);

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
