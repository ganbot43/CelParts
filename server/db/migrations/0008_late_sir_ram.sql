ALTER TABLE `banners` ADD `eyebrow` varchar(80);--> statement-breakpoint
ALTER TABLE `banners` ADD `title` varchar(160);--> statement-breakpoint
ALTER TABLE `banners` ADD `subtitle` varchar(300);--> statement-breakpoint
ALTER TABLE `banners` ADD `cta_label` varchar(60);--> statement-breakpoint
ALTER TABLE `banners` ADD `align` varchar(10) DEFAULT 'left' NOT NULL;