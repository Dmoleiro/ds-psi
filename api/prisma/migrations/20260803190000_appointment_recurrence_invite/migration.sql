-- AlterTable
ALTER TABLE `appointments`
    ADD COLUMN `recurrence_cadence` VARCHAR(191) NULL,
    ADD COLUMN `recurrence_until` VARCHAR(191) NULL;
