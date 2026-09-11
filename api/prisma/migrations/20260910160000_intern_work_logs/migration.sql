-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_intern` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `intern_work_logs` (
    `id` VARCHAR(191) NOT NULL,
    `intern_id` VARCHAR(191) NOT NULL,
    `work_date` VARCHAR(10) NOT NULL,
    `hours` DECIMAL(4, 2) NOT NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `intern_work_logs_intern_id_work_date_idx`(`intern_id`, `work_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `intern_work_logs` ADD CONSTRAINT `intern_work_logs_intern_id_fkey` FOREIGN KEY (`intern_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
