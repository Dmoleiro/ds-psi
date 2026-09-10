-- Volume VII checklists are fillable via the patient link (family/caregiver).
UPDATE `picca_modules`
SET `therapist_only` = false, `updated_at` = CURRENT_TIMESTAMP(3)
WHERE `volume` = 7;
