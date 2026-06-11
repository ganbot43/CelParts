CREATE TABLE `materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(191) NOT NULL,
	`is_active` int NOT NULL DEFAULT 1,
	CONSTRAINT `materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `materials_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `material_id` int;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_material_id_materials_id_fk` FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `material`;