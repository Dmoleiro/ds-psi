-- Volume II — manual clínico de referência (marcos do desenvolvimento 0–6 anos)
INSERT INTO `picca_modules` (`id`, `volume`, `module_number`, `sort_order`, `title`, `description`, `therapist_only`, `active`, `updated_at`) VALUES
('picca-vol2-mod1', 2, 1, 1, 'Fundamentos do Desenvolvimento Infantil', 'Manual clínico de referência: conceitos, domínios, marcos, sinais de alerta e grelhas de apoio (12 secções).', true, true, CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `therapist_only` = VALUES(`therapist_only`),
  `active` = VALUES(`active`),
  `updated_at` = CURRENT_TIMESTAMP(3);
