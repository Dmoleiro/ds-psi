-- AlterTable
ALTER TABLE `patients`
ADD COLUMN `delivered_form_ids` JSON NOT NULL DEFAULT ('[]') AFTER `questionnaire_selections`;
