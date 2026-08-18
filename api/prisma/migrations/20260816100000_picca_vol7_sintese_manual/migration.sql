-- Volume VII — síntese integrada DC:0–5 e manual clínico de referência
INSERT INTO `picca_modules` (`id`, `volume`, `module_number`, `sort_order`, `title`, `description`, `therapist_only`, `active`, `updated_at`) VALUES
('picca-vol7-mod34', 7, 34, 34, 'Síntese Integrada DC:0–5', 'Integração transversal dos checklists clínicos, mapa de hipóteses e formulação conclusiva.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol7-mod35', 7, 35, 35, 'Manual Clínico de Diagnóstico em Idade Pré-Escolar', 'Referência clínica completa: desenvolvimento, red flags, formulação e instrumentos (18 capítulos).', true, true, CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `therapist_only` = VALUES(`therapist_only`),
  `active` = VALUES(`active`),
  `updated_at` = CURRENT_TIMESTAMP(3);
