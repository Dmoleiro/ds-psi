INSERT INTO `form_definitions` (`id`, `title`, `description`, `schema_json`, `active`, `version`, `category`) VALUES
(
  'vineland',
  'VINELAND — Escala de Comportamento Adaptativo',
  'Vineland-II, Forma Sintética de Entrevista (versão portuguesa). Comunicação, Autonomia, Socialização, Motricidade e Comportamento Desajustado.',
  '{}',
  1,
  1,
  'questionnaire'
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`);
