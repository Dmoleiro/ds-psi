-- WISC subtest / scale result tables for patient evaluation methods
ALTER TABLE `patients`
ADD COLUMN `wisc_results` JSON NOT NULL DEFAULT ('{}') AFTER `wisc_selections`;
