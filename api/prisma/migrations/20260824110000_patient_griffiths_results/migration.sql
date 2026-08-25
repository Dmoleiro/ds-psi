-- Ruth Griffiths assessment results summary for patient evaluation methods
ALTER TABLE `patients`
ADD COLUMN `griffiths_results` JSON NOT NULL DEFAULT ('{}') AFTER `banc_results`;
