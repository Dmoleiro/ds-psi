ALTER TABLE `picca_interactive_forms`
  MODIFY COLUMN `kind` ENUM('daily_sono', 'weekly_estrategias', 'weekly_kit', 'portage_assessment') NOT NULL;

INSERT INTO `picca_interactive_forms` (`id`, `kind`, `sort_order`, `title`, `description`, `active`, `updated_at`) VALUES
('picca-interactive-portage', 'portage_assessment', 9, 'Guia Portage de Educação Pré-Escolar', 'Inventário Portage para avaliação desenvolvimental e planeamento educativo (S/N/AV por item).', true, CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE
  `kind` = VALUES(`kind`),
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `active` = VALUES(`active`),
  `updated_at` = CURRENT_TIMESTAMP(3);
