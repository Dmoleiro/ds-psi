-- Volume VI — checklists de neurodesenvolvimento (terapeuta)
INSERT INTO `picca_modules` (`id`, `volume`, `module_number`, `sort_order`, `title`, `description`, `therapist_only`, `active`, `updated_at`) VALUES
('picca-vol6-mod1', 6, 1, 1, 'Perturbação do Desenvolvimento Intelectual', 'Checklist clínico estruturado para avaliação da perturbação do desenvolvimento intelectual.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod2', 6, 2, 2, 'Atraso Global do Desenvolvimento', 'Checklist clínico para crianças com atrasos significativos em várias áreas do desenvolvimento.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod3', 6, 3, 3, 'Perturbação da Linguagem', 'Checklist clínico para perturbações da linguagem receptiva e expressiva.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod4', 6, 4, 4, 'Perturbação dos Sons da Fala', 'Checklist clínico para perturbações dos sons da fala e articulação.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod5', 6, 5, 5, 'Perturbação da Fluência com Início na Infância', 'Checklist clínico para perturbações da fluência da fala.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod6', 6, 6, 6, 'Perturbação da Comunicação Social (Pragmática)', 'Checklist clínico para perturbações pragmáticas da comunicação social.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod7', 6, 7, 7, 'Perturbação do Espetro do Autismo', 'Checklist clínico para perturbação do espetro do autismo.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod8', 6, 8, 8, 'Perturbação de Hiperatividade e Défice de Atenção', 'Checklist clínico para PHDA e perfis de atenção/hiperatividade.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod9', 6, 9, 9, 'Perturbação Específica da Aprendizagem', 'Checklist clínico para perturbações específicas da aprendizagem.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod10', 6, 10, 10, 'Perturbação do Desenvolvimento da Coordenação', 'Checklist clínico para perturbação do desenvolvimento da coordenação.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod11', 6, 11, 11, 'Perturbação dos Movimentos Estereotipados', 'Checklist clínico para perturbações dos movimentos estereotipados.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod12', 6, 12, 12, 'Perturbações de Tiques', 'Checklist clínico para perturbações de tiques e síndrome de Tourette.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod13', 6, 13, 13, 'Outras Perturbações do Neurodesenvolvimento', 'Checklist clínico para outras perturbações do neurodesenvolvimento.', true, true, CURRENT_TIMESTAMP(3)),
('picca-vol6-mod14', 6, 14, 14, 'Síntese Integrada e Formulação de Hipóteses', 'Integração transversal dos checklists, mapa de hipóteses e formulação conclusiva.', true, true, CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `therapist_only` = VALUES(`therapist_only`),
  `active` = VALUES(`active`),
  `updated_at` = CURRENT_TIMESTAMP(3);
