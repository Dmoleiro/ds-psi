ALTER TABLE `picca_interactive_forms`
  MODIFY COLUMN `kind` ENUM('daily_sono', 'weekly_estrategias', 'weekly_kit') NOT NULL;

INSERT INTO `picca_interactive_forms` (`id`, `kind`, `sort_order`, `title`, `description`, `active`, `updated_at`) VALUES
('picca-interactive-kit-rotinas', 'weekly_kit', 3, 'Kit Pais — Rotinas Familiares', 'Planeamento semanal das rotinas e registo diário da corresponsabilidade parental.', true, CURRENT_TIMESTAMP(3)),
('picca-interactive-kit-sono', 'weekly_kit', 4, 'Kit Pais — Diário do Sono', 'Rotina do sono, registo semanal e indicadores de qualidade do sono.', true, CURRENT_TIMESTAMP(3)),
('picca-interactive-kit-birras', 'weekly_kit', 5, 'Kit Pais — Registo de Birras', 'Análise funcional dos episódios de desregulação emocional (registo por semana).', true, CURRENT_TIMESTAMP(3)),
('picca-interactive-kit-autonomia', 'weekly_kit', 6, 'Kit Pais — Plano de Autonomia', 'Competências de vida diária, plano gradual e registo semanal.', true, CURRENT_TIMESTAMP(3)),
('picca-interactive-kit-flexibilidade', 'weekly_kit', 7, 'Kit Pais — Flexibilidade Cognitiva', 'Desafios de flexibilidade, escada de progressão e registo de situações.', true, CURRENT_TIMESTAMP(3)),
('picca-interactive-kit-conquistas', 'weekly_kit', 8, 'Kit Pais — Quadro das Conquistas', 'Sistema de reforço positivo com autocolantes e recompensas combinadas.', true, CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `kind` = VALUES(`kind`),
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `active` = VALUES(`active`),
  `updated_at` = CURRENT_TIMESTAMP(3);
