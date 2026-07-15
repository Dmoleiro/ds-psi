-- AlterTable
ALTER TABLE `attendance_records` MODIFY `status` ENUM('present_unpaid', 'present_paid', 'receipt_issued', 'absent') NOT NULL;
