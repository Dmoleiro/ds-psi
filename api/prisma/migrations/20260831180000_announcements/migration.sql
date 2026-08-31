-- Landing page announcements (image + visibility end date)

CREATE TABLE `announcements` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NULL,
  `image_path` VARCHAR(191) NOT NULL,
  `visible_until` DATE NOT NULL,
  `created_by_id` VARCHAR(191) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `announcements_visible_until_idx`(`visible_until`),
  INDEX `announcements_created_at_idx`(`created_at`),
  CONSTRAINT `announcements_created_by_id_fkey`
    FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
