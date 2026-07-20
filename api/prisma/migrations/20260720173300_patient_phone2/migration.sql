-- Add optional second phone number for patients
ALTER TABLE `patients` ADD COLUMN `phone_2` VARCHAR(191) NULL;
