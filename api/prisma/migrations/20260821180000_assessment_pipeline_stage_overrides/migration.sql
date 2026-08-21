-- AlterTable
ALTER TABLE `patients`
    ADD COLUMN `assessment_pipeline_stage_overrides` JSON NOT NULL DEFAULT ('{}');
