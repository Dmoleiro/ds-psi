-- Patient evaluation method selections (WISC III / BANC checklists)
ALTER TABLE `patients`
  ADD COLUMN `wisc_selections` JSON NOT NULL DEFAULT (JSON_ARRAY()),
  ADD COLUMN `banc_selections` JSON NOT NULL DEFAULT (JSON_ARRAY());
