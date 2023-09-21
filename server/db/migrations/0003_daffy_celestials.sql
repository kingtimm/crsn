CREATE TABLE `faves` (
	`id` integer PRIMARY KEY NOT NULL,
	`first_name_id` integer,
	`middle_name_id` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`first_name_id`) REFERENCES `names`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`middle_name_id`) REFERENCES `names`(`id`) ON UPDATE no action ON DELETE no action
);
