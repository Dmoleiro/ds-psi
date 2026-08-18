-- Replace mistaken CAST entry with Inventário de Síndrome de Asperger
UPDATE `form_definitions`
SET
  `id` = 'inventario_asperger',
  `title` = 'Inventário de Síndrome de Asperger',
  `description` = 'Inventário clínico de comportamentos e características (75 itens, escala 0–3, mais questões complementares).',
  `category` = 'questionnaire'
WHERE `id` = 'cast';

INSERT INTO `form_definitions` (`id`, `title`, `description`, `schema_json`, `active`, `version`, `category`) VALUES
(
  'inventario_asperger',
  'Inventário de Síndrome de Asperger',
  'Inventário clínico de comportamentos e características (75 itens, escala 0–3, mais questões complementares).',
  '{}',
  1,
  1,
  'questionnaire'
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`);

DELETE FROM `form_definitions` WHERE `id` = 'cast';
