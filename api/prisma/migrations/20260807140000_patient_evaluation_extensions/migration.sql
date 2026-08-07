ALTER TABLE `patients`
  ADD COLUMN `additional_method_selections` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  ADD COLUMN `questionnaire_selections` JSON NOT NULL DEFAULT (JSON_ARRAY());
