-- Add form category and session kind for questionnaire flow
ALTER TABLE `form_definitions`
  ADD COLUMN `category` ENUM('intake', 'questionnaire') NOT NULL DEFAULT 'intake' AFTER `version`;

ALTER TABLE `intake_sessions`
  ADD COLUMN `session_kind` ENUM('intake', 'questionnaire') NOT NULL DEFAULT 'intake' AFTER `therapist_id`;

UPDATE `form_definitions`
SET `category` = 'intake'
WHERE `id` IN ('ficha-inscricao', 'queixa-inicial', 'anexar-documentos');

INSERT INTO `form_definitions` (`id`, `title`, `description`, `schema_json`, `active`, `version`, `category`) VALUES
('sdq_p_3_4', 'SDQ-P (3–4 anos)', 'Questionário de Capacidades e Dificuldades para crianças dos 3 aos 4 anos.', '{}', 1, 1, 'questionnaire'),
('sdq_4_17', 'SDQ (4–17 anos)', 'Questionário de Capacidades e Dificuldades para crianças e jovens dos 4 aos 17 anos.', '{}', 1, 1, 'questionnaire'),
('sdq_prof', 'SDQ — Professores', 'Versão para professores do Questionário de Capacidades e Dificuldades.', '{}', 1, 1, 'questionnaire'),
('cbcl_18m_5', 'ASEBA — CBCL (18 meses–5 anos)', 'Child Behavior Checklist — versão pré-escolar.', '{}', 1, 1, 'questionnaire'),
('cbcl', 'ASEBA — CBCL (6–18 anos)', 'Child Behavior Checklist — versão para pais.', '{}', 1, 1, 'questionnaire'),
('ctrf_18m_5', 'ASEBA — C-TRF (18 meses–5 anos)', 'Caregiver-Teacher Report Form — versão pré-escolar.', '{}', 1, 1, 'questionnaire'),
('trf', 'ASEBA — TRF', 'Teacher Report Form — versão para professores.', '{}', 1, 1, 'questionnaire'),
('ysr', 'ASEBA — YSR', 'Youth Self Report — autorrelato.', '{}', 1, 1, 'questionnaire'),
('conners_pais', 'Conners — Pais', 'Escala de Conners para pais.', '{}', 1, 1, 'questionnaire'),
('conners_professores', 'Conners — Professores', 'Escala de Conners para professores.', '{}', 1, 1, 'questionnaire'),
('conners_pre_escolar', 'Conners — Idade Pré-escolar', 'Conners para idade pré-escolar.', '{}', 1, 1, 'questionnaire'),
('conners_idade_escolar_pais', 'Conners — Idade Escolar (Pais)', 'Conners para idade escolar — versão pais.', '{}', 1, 1, 'questionnaire'),
('scared_crianca', 'SCARED — Criança', 'Screen for Child Anxiety Related Disorders (versão criança).', '{}', 1, 1, 'questionnaire'),
('scared_pais', 'SCARED — Pais', 'Screen for Child Anxiety Related Disorders (versão pais).', '{}', 1, 1, 'questionnaire'),
('adexi_self', 'ADEXI — Auto-relato', 'Inventário de Funcionamento Executivo do Adulto (auto-relato).', '{}', 1, 1, 'questionnaire'),
('adexi_other', 'ADEXI — Informador', 'Inventário de Funcionamento Executivo do Adulto (informador).', '{}', 1, 1, 'questionnaire'),
('brief_pre_escolar', 'BRIEF — Idade Pré-escolar', 'Avaliação das funções executivas (pré-escolar).', '{}', 1, 1, 'questionnaire'),
('brief_idade_escolar_pais', 'BRIEF — Idade Escolar (Pais)', 'Avaliação das funções executivas — idade escolar (pais).', '{}', 1, 1, 'questionnaire'),
('rcmas', 'RCMAS', 'Escala Revista de Ansiedade Manifesta para Crianças.', '{}', 1, 1, 'questionnaire'),
('chexi', 'CHEXI', 'Inventário de Funcionamento Executivo de Crianças.', '{}', 1, 1, 'questionnaire'),
('diva', 'DIVA-5 (5–17 anos)', 'Entrevista de diagnóstico para TDAH em jovens.', '{}', 1, 1, 'questionnaire'),
('iep', 'Inventário de Estilos Parentais (IEP)', 'Práticas educativas maternas e paternas.', '{}', 1, 1, 'questionnaire'),
('psvc', 'PSVC', 'Questionário Síndrome de Asperger.', '{}', 1, 1, 'questionnaire'),
('fssr', 'FSSR — Questionário de Medos', 'Inventário de medos infantis.', '{}', 1, 1, 'questionnaire'),
('m_chat', 'M-CHAT', 'Modified Checklist for Autism in Toddlers.', '{}', 1, 1, 'questionnaire'),
('inventario_estereotipias', 'Inventário de Estereotipias', 'Registo de comportamentos estereotipados.', '{}', 1, 1, 'questionnaire'),
('cars', 'CARS', 'Childhood Autism Rating Scale.', '{}', 1, 1, 'questionnaire'),
('obq_44', 'OBQ-44', 'Obsessional Beliefs Questionnaire.', '{}', 1, 1, 'questionnaire'),
('cdi', 'CDI', 'Children''s Depression Inventory.', '{}', 1, 1, 'questionnaire'),
('edah', 'EDAH', 'Escala de Avaliação de Hiperactividade.', '{}', 1, 1, 'questionnaire')
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `active` = 1,
  `category` = 'questionnaire';
