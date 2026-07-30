-- Coordinator-to-therapist access assignments (admin-managed)
-- Uses surrogate id + prefixed unique index (MySQL max key length with utf8mb4)

CREATE TABLE `coordinator_therapists` (
  `id` VARCHAR(191) NOT NULL,
  `coordinator_id` VARCHAR(191) NOT NULL,
  `therapist_id` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `coordinator_therapists_coordinator_id_therapist_id_key`(`coordinator_id`(36), `therapist_id`(36)),
  INDEX `coordinator_therapists_therapist_id_idx`(`therapist_id`),
  CONSTRAINT `coordinator_therapists_coordinator_id_fkey`
    FOREIGN KEY (`coordinator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `coordinator_therapists_therapist_id_fkey`
    FOREIGN KEY (`therapist_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
