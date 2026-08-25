-- AlterTable
ALTER TABLE `patients`
ADD COLUMN `pre_escolar_results` JSON NOT NULL DEFAULT ('{}') AFTER `griffiths_results`;
