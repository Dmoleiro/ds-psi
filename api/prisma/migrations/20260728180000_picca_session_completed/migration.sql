ALTER TABLE `picca_sessions`
  MODIFY COLUMN `status` ENUM('active', 'in_progress', 'completed', 'revoked') NOT NULL;

ALTER TABLE `picca_interactive_sessions`
  MODIFY COLUMN `status` ENUM('active', 'in_progress', 'completed', 'revoked') NOT NULL;
