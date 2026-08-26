-- Read-only therapist accounts (interns) and supervisor assignments

ALTER TABLE `users` ADD COLUMN `read_only` BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE `therapist_supervisors` (
  `id` VARCHAR(191) NOT NULL,
  `intern_id` VARCHAR(191) NOT NULL,
  `supervisor_id` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `therapist_supervisors_intern_id_supervisor_id_key`(`intern_id`(36), `supervisor_id`(36)),
  INDEX `therapist_supervisors_supervisor_id_idx`(`supervisor_id`),
  CONSTRAINT `therapist_supervisors_intern_id_fkey`
    FOREIGN KEY (`intern_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `therapist_supervisors_supervisor_id_fkey`
    FOREIGN KEY (`supervisor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
