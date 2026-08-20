-- AlterTable
ALTER TABLE `users`
  ADD COLUMN `questionnaires_enabled` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `assessment_results_enabled` BOOLEAN NOT NULL DEFAULT false;
