INSERT INTO `form_definitions` (`id`, `title`, `description`, `schema_json`, `active`, `version`)
VALUES (
  'queixa-inicial',
  'Queixa inicial e preocupações',
  'Questionário sobre a queixa inicial, sintomas observados e motivo do pedido de consulta.',
  '{}',
  true,
  1
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `active` = true;
