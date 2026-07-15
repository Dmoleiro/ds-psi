-- Add optional phone number for staff profiles
ALTER TABLE `users` ADD COLUMN `phone` VARCHAR(191) NULL;
