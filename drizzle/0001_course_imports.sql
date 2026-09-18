CREATE TABLE `course_imports` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `file_name` text NOT NULL,
  `object_key` text NOT NULL,
  `content_type` text NOT NULL,
  `size` integer NOT NULL,
  `status` text NOT NULL,
  `created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_course_imports_user_created` ON `course_imports` (`user_id`,`created_at`);
