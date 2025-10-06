-- Add AgentLead table for discovered travel agencies
CREATE TABLE IF NOT EXISTS `AgentLead` (
  `id` VARCHAR(191) NOT NULL,
  `companyName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(100) NULL,
  `website` VARCHAR(500) NULL,
  `address` TEXT NULL,
  `city` VARCHAR(100) NULL,
  `country` VARCHAR(100) NOT NULL,
  `source` VARCHAR(50) NOT NULL,
  `searchQuery` VARCHAR(500) NULL,
  `discovered` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `contacted` BOOLEAN NOT NULL DEFAULT false,
  `convertedToAgent` BOOLEAN NOT NULL DEFAULT false,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `AgentLead_country_city_idx`(`country`, `city`),
  INDEX `AgentLead_contacted_idx`(`contacted`),
  INDEX `AgentLead_email_idx`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
