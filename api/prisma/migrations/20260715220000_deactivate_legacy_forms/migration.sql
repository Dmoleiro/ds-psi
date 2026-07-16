UPDATE `form_definitions`
SET `active` = false
WHERE `id` IN ('intake', 'consent', 'history');
