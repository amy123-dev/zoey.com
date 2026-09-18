CREATE TABLE `review_events` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`grade` integer NOT NULL,
	`at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_review_user_at` ON `review_events` (`user_id`,`at`);--> statement-breakpoint
CREATE TABLE `progress` (
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`level` integer NOT NULL,
	`due` integer NOT NULL,
	`attempts` integer NOT NULL,
	`wrong` integer NOT NULL,
	`updated` integer NOT NULL,
	PRIMARY KEY(`user_id`, `card_id`)
);
