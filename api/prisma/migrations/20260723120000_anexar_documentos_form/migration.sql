INSERT INTO `form_definitions` (`id`, `title`, `description`, `schema_json`, `active`, `version`)
VALUES (
  'anexar-documentos',
  'Anexar documentos',
  'Carregue documentos em PDF (por exemplo, relatórios escolares ou exames). Pode voltar a este link quando quiser para anexar mais ficheiros.',
  '{}',
  true,
  1
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `active` = true;
