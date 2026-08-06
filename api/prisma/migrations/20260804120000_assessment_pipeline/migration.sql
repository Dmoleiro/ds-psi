-- AlterTable
ALTER TABLE `patients`
    ADD COLUMN `assessment_pipeline_stage` ENUM('intake', 'avaliacao', 'picca', 'relatorio', 'concluido') NOT NULL DEFAULT 'intake',
    ADD COLUMN `assessment_pipeline_notes` TEXT NULL,
    ADD COLUMN `assessment_report_delivered_at` DATETIME(3) NULL;
