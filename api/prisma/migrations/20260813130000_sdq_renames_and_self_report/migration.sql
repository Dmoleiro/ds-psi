UPDATE `form_definitions`
SET `title` = 'SDQ-P (3–4 anos) - PAIS'
WHERE `id` = 'sdq_p_3_4';

UPDATE `form_definitions`
SET `title` = 'SDQ (4–17 anos) - PAIS'
WHERE `id` = 'sdq_4_17';

INSERT INTO `form_definitions` (`id`, `title`, `description`, `schema_json`, `active`, `version`, `category`) VALUES
(
  'sdq_autoavaliacao_4_17',
  'SDQ-AUTOAVALIAÇÃO (4-17 ANOS)',
  'Questionário de Capacidades e Dificuldades — autoavaliação para crianças e jovens dos 4 aos 17 anos.',
  '{}',
  1,
  1,
  'questionnaire'
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `category` = VALUES(`category`);
