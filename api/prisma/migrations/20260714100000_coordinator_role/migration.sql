-- Add coordinator role (read-only administrative user for attendance viewing)
ALTER TABLE `users` MODIFY `role` ENUM('admin', 'therapist', 'coordinator') NOT NULL;
