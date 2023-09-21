CREATE TABLE `names` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
