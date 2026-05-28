CREATE TABLE `banners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`image_url` text NOT NULL,
	`link_url` text,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` int NOT NULL DEFAULT 1,
	CONSTRAINT `banners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `business_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`logo_url` text,
	`whatsapp` text NOT NULL,
	`address` text,
	`plan` varchar(20) NOT NULL DEFAULT 'basic',
	`social_links` text,
	`stock_enabled` int NOT NULL DEFAULT 0,
	`auto_payment_enabled` int NOT NULL DEFAULT 0,
	`coupons_enabled` int NOT NULL DEFAULT 0,
	`multiuser_enabled` int NOT NULL DEFAULT 0,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `business_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(191) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` int NOT NULL DEFAULT 1,
	`seccion` int,
	`id_producto` int,
	`imagen_banner` text,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `complaints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(100) NOT NULL DEFAULT '',
	`customer_name` text NOT NULL,
	`tipo_documento` text NOT NULL,
	`numero_documento` text NOT NULL,
	`direccion` text,
	`telefono` text NOT NULL,
	`email` text NOT NULL,
	`tipo_bien` text NOT NULL,
	`descripcion_bien` text NOT NULL,
	`monto` double,
	`tipo_reclamo` text NOT NULL,
	`descripcion` text NOT NULL,
	`pedido` text NOT NULL,
	`estado` varchar(20) NOT NULL DEFAULT 'pendiente',
	`respuesta` text,
	`fecha_respuesta` text,
	`archivo_url` text,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `complaints_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`product_id` int,
	`product_name` text NOT NULL,
	`unit_price` double NOT NULL,
	`quantity` int NOT NULL,
	`subtotal` double NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_status_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`status` varchar(30) NOT NULL,
	`changed_by` int,
	`note` text,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `order_status_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_code` varchar(191) NOT NULL,
	`payment_method_id` int,
	`payment_method_type` text,
	`payment_method_label` text,
	`payment_method_qr_url` text,
	`payment_method_account_number` text,
	`payment_method_account_name` text,
	`customer_name` text NOT NULL,
	`customer_phone` text,
	`customer_address` text,
	`customer_reference` text,
	`customer_notes` text,
	`subtotal` double NOT NULL,
	`total` double NOT NULL,
	`voucher_url` text,
	`status` varchar(30) NOT NULL DEFAULT 'pending',
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_order_code_unique` UNIQUE(`order_code`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(30) NOT NULL,
	`label` text NOT NULL,
	`qr_url` text,
	`account_number` text,
	`account_name` text,
	`is_active` int NOT NULL DEFAULT 1,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`url` text NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_primary` int NOT NULL DEFAULT 0,
	CONSTRAINT `product_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category_id` int,
	`subcategory_id` int,
	`name` text NOT NULL,
	`slug` varchar(191) NOT NULL,
	`description` text,
	`price` double NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`track_stock` int NOT NULL DEFAULT 0,
	`is_featured` int NOT NULL DEFAULT 0,
	`nuevo_lanzamiento` int NOT NULL DEFAULT 0,
	`is_active` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `subcategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category_id` int NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(191) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` int NOT NULL DEFAULT 1,
	CONSTRAINT `subcategories_id` PRIMARY KEY(`id`),
	CONSTRAINT `subcategories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` varchar(191) NOT NULL,
	`password_hash` text NOT NULL,
	`role` varchar(20) NOT NULL DEFAULT 'admin',
	`is_active` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_status_logs` ADD CONSTRAINT `order_status_logs_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_status_logs` ADD CONSTRAINT `order_status_logs_changed_by_users_id_fk` FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_method_id_payment_methods_id_fk` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_subcategory_id_subcategories_id_fk` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subcategories` ADD CONSTRAINT `subcategories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;