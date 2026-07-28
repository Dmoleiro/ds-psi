-- AlterTable
ALTER TABLE `picca_modules` ADD COLUMN `therapist_only` BOOLEAN NOT NULL DEFAULT false;

-- Seed Volume I modules 1, 5, 6, 7 (1/5/6 = family link; 7 = therapist-only)
INSERT INTO `picca_modules` (`id`, `volume`, `module_number`, `sort_order`, `title`, `description`, `therapist_only`, `active`, `updated_at`) VALUES
('picca-vol1-mod1', 1, 1, 1, 'Identificação e Referenciação', 'Dados da criança, cuidadores, motivo da referenciação, objetivos da avaliação e síntese clínica inicial.', false, true, CURRENT_TIMESTAMP(3)),
('picca-vol1-mod5', 1, 5, 5, 'Funcionamento Atual', 'Caracterização do funcionamento atual nos domínios cognitivo, emocional, comportamental, social e adaptativo.', false, true, CURRENT_TIMESTAMP(3)),
('picca-vol1-mod6', 1, 6, 6, 'Percurso Escolar e Funcionamento Académico', 'Percurso escolar, funcionamento académico atual, apoios educativos e integração clínica.', false, true, CURRENT_TIMESTAMP(3)),
('picca-vol1-mod7', 1, 7, 7, 'Observação Clínica e Exame do Estado Mental', 'Observação sistemática durante a avaliação, com indicadores de alerta e integração nos 5 P''s.', true, true, CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `therapist_only` = VALUES(`therapist_only`),
  `active` = VALUES(`active`),
  `updated_at` = CURRENT_TIMESTAMP(3);
