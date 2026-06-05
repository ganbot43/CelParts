ALTER TABLE `banners` ADD `title` text;--> statement-breakpoint
ALTER TABLE `banners` ADD `subtitle` text;--> statement-breakpoint
ALTER TABLE `products` ADD `seller_id` int;--> statement-breakpoint
ALTER TABLE `products` ADD `material` text;--> statement-breakpoint
ALTER TABLE `products` ADD `size_length` int;--> statement-breakpoint
ALTER TABLE `products` ADD `size_width` int;--> statement-breakpoint
ALTER TABLE `products` ADD `size_unit` varchar(10) DEFAULT 'cm';--> statement-breakpoint
ALTER TABLE `products` ADD `offers_pattern` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `products` ADD `status` varchar(30) DEFAULT 'disponible';--> statement-breakpoint
ALTER TABLE `users` ADD `dni` varchar(8);--> statement-breakpoint
ALTER TABLE `users` ADD `address` text;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_seller_id_users_id_fk` FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;