INSERT INTO `form_definitions` (`id`, `title`, `description`, `schema_json`, `active`, `version`, `category`) VALUES
(
  'adir',
  'ADI-R — Entrevista para autismo',
  'Autism Diagnostic Interview — Revised. Entrevista estruturada para diagnóstico de autismo (versão portuguesa).',
  '{}',
  1,
  1,
  'questionnaire'
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`);
