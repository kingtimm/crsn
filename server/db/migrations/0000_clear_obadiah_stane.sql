CREATE TABLE `babies` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`last_name` text NOT NULL,
	`gender` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faves` (
	`id` integer PRIMARY KEY NOT NULL,
	`first_name_id` integer,
	`middle_name_id` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`first_name_id`) REFERENCES `names`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`middle_name_id`) REFERENCES `names`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `faves_to_babies` (
	`position` integer DEFAULT -1,
	`fave_id` integer NOT NULL,
	`baby_id` integer NOT NULL,
	PRIMARY KEY(`baby_id`, `fave_id`),
	FOREIGN KEY (`fave_id`) REFERENCES `faves`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`baby_id`) REFERENCES `babies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `membership` (
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`baby_id` integer,
	`role` text NOT NULL,
	PRIMARY KEY(`baby_id`, `user_id`),
	FOREIGN KEY (`baby_id`) REFERENCES `babies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `membership_invitation` (
	`invite_id` text PRIMARY KEY NOT NULL,
	`baby_id` integer NOT NULL,
	`inviter_user_id` text NOT NULL,
	`expire_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `names` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `names_to_babies` (
	`name_id` integer NOT NULL,
	`baby_id` integer NOT NULL,
	PRIMARY KEY(`baby_id`, `name_id`),
	FOREIGN KEY (`name_id`) REFERENCES `names`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`baby_id`) REFERENCES `babies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `faves_first_name_id_middle_name_id_unique` ON `faves` (`first_name_id`,`middle_name_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `names_name_unique` ON `names` (`name`);