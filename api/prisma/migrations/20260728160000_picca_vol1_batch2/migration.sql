-- Seed Volume I modules 8, 9, 10 (therapist-only)
INSERT INTO `picca_modules` (`id`, `volume`, `module_number`, `sort_order`, `title`, `description`, `therapist_only`, `active`, `updated_at`) VALUES
('picca-vol1-mod8', 1, 8, 8, 'Síntese Clínica Inicial e Formulação de Caso', 'Integração da anamnese, observação e avaliação psicológica com formulação nos 5 P''s e objetivos prioritários.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol1-mod9', 1, 9, 9, 'Plano Integrado de Intervenção e Monitorização Clínica', 'Plano de intervenção individualizado com objetivos SMART, estratégias e indicadores de evolução.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol1-mod10', 1, 10, 10, 'Relatório Clínico Integrado e Devolução de Resultados', 'Síntese final da avaliação, conclusões diagnósticas, recomendações e registo da devolução.', true, true, CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `therapist_only` = VALUES(`therapist_only`),
  `active` = VALUES(`active`),
  `updated_at` = CURRENT_TIMESTAMP(3);
