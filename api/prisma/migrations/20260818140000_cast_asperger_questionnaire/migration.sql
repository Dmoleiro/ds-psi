-- CAST (Childhood Asperger Syndrome Test / Childhood Autism Spectrum Test)
INSERT INTO `form_definitions` (`id`, `title`, `description`, `schema_json`, `active`, `version`, `category`) VALUES
(
  'cast',
  'CAST — Teste Infantil (Síndrome de Asperger)',
  'Triagem para crianças dos 4 aos 11 anos (37 itens; pontuação ≥15 sugere avaliação especializada).',
  '{}',
  1,
  1,
  'questionnaire'
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`);
