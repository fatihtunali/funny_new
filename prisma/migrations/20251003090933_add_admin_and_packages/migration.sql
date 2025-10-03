-- AlterTable
ALTER TABLE `contactinquiry` ADD COLUMN `source` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Package` (
    `id` VARCHAR(191) NOT NULL,
    `packageId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `itinerary` TEXT NOT NULL,
    `highlights` TEXT NOT NULL,
    `included` TEXT NOT NULL,
    `notIncluded` TEXT NOT NULL,
    `destinations` VARCHAR(191) NOT NULL,
    `pricing` TEXT NOT NULL,
    `hotels` TEXT NOT NULL,
    `pdfUrl` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Package_packageId_key`(`packageId`),
    UNIQUE INDEX `Package_slug_key`(`slug`),
    INDEX `Package_packageId_idx`(`packageId`),
    INDEX `Package_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
