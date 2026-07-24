-- AlterTable
ALTER TABLE `appointments` ADD COLUMN `room` ENUM('gabinete_1', 'gabinete_2') NOT NULL DEFAULT 'gabinete_1';

-- CreateIndex
CREATE INDEX `appointments_room_scheduled_at_idx` ON `appointments`(`room`, `scheduled_at`);
