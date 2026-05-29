ALTER TABLE `business_config` MODIFY COLUMN `stock_enabled` int NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `track_stock` int NOT NULL DEFAULT 1;