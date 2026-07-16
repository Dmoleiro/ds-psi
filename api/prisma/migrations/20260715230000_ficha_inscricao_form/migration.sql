INSERT INTO `form_definitions` (`id`, `title`, `description`, `schema_json`, `active`, `version`)
VALUES (
  'ficha-inscricao',
  'Ficha de inscrição',
  'Dados da criança/jovem, encarregado de educação e motivo do pedido.',
  '{}',
  true,
  1
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `active` = true;
