INSERT INTO `picca_interactive_forms` (`id`, `kind`, `sort_order`, `title`, `description`, `active`, `updated_at`) VALUES
(
  'picca-interactive-kit-comportamentos',
  'weekly_kit',
  9,
  'Kit Pais — Comportamentos para pais',
  'Tabela de antecedentes, comportamentos, reações parentais e consequências.',
  true,
  CURRENT_TIMESTAMP(3)
)
ON DUPLICATE KEY UPDATE
  `kind` = VALUES(`kind`),
  `sort_order` = VALUES(`sort_order`),
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `active` = VALUES(`active`),
  `updated_at` = CURRENT_TIMESTAMP(3);
