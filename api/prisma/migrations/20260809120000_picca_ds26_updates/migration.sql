-- DS_26: align module 3 description with clinical objective text
UPDATE `picca_modules`
SET
  `description` = 'Fatores pré-natais, peri-natais e neonatais relevantes para a conceptualização clínica e neurodesenvolvimento.',
  `updated_at` = CURRENT_TIMESTAMP(3)
WHERE `id` = 'picca-vol1-mod3';
