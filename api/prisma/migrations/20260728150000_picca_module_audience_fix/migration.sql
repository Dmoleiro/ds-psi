-- Volume I modules 1, 5, 6: family (patient link). Modules 7–10: therapist-only.
UPDATE `picca_modules` SET `therapist_only` = false, `updated_at` = CURRENT_TIMESTAMP(3)
WHERE `id` IN ('picca-vol1-mod1', 'picca-vol1-mod5', 'picca-vol1-mod6');

UPDATE `picca_modules` SET `therapist_only` = true, `updated_at` = CURRENT_TIMESTAMP(3)
WHERE `id` = 'picca-vol1-mod7';
