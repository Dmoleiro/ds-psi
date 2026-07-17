-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `recurrence_group_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `appointments_recurrence_group_id_idx` ON `appointments`(`recurrence_group_id`);
