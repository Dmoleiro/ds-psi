-- Store patient magic-link token so therapists can retrieve it while session is open
ALTER TABLE `intake_sessions` ADD COLUMN `patient_token` VARCHAR(191) NULL;
