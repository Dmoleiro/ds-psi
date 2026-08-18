-- Remove Conners pré-escolar from active catalogue (keep row for historical submissions)
UPDATE `form_definitions`
SET `active` = 0
WHERE `id` = 'conners_pre_escolar';
