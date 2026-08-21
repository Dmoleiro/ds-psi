-- BANC perfil de resultados and composite tables for patient evaluation methods
ALTER TABLE `patients`
ADD COLUMN `banc_results` JSON NOT NULL DEFAULT ('{}') AFTER `banc_selections`;
