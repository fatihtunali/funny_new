-- Migration: Add Spanish language fields to Destination table
-- This migration adds Spanish translation fields for multi-language destination support
-- Date: 2025-10-27
-- Description: Adds nameEs, descriptionEs, attractionsEs, experiencesEs, and SEO fields

-- Add Spanish name field
ALTER TABLE `Destination` ADD COLUMN `nameEs` VARCHAR(191) NULL AFTER `description`;

-- Add Spanish description field
ALTER TABLE `Destination` ADD COLUMN `descriptionEs` TEXT NULL AFTER `nameEs`;

-- Add Spanish attractions field (JSON)
ALTER TABLE `Destination` ADD COLUMN `attractionsEs` TEXT NULL AFTER `descriptionEs`;

-- Add Spanish experiences field (JSON)
ALTER TABLE `Destination` ADD COLUMN `experiencesEs` TEXT NULL AFTER `attractionsEs`;

-- Add Spanish best time to visit field
ALTER TABLE `Destination` ADD COLUMN `bestTimeToVisitEs` TEXT NULL AFTER `experiencesEs`;

-- Add Spanish getting there field
ALTER TABLE `Destination` ADD COLUMN `gettingThereEs` TEXT NULL AFTER `bestTimeToVisitEs`;

-- Add Spanish meta title field
ALTER TABLE `Destination` ADD COLUMN `metaTitleEs` VARCHAR(191) NULL AFTER `gettingThereEs`;

-- Add Spanish meta description field
ALTER TABLE `Destination` ADD COLUMN `metaDescriptionEs` TEXT NULL AFTER `metaTitleEs`;

-- Verify the migration
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM
    INFORMATION_SCHEMA.COLUMNS
WHERE
    TABLE_NAME = 'Destination'
    AND COLUMN_NAME LIKE '%Es'
ORDER BY
    ORDINAL_POSITION;

-- Success message
SELECT 'Spanish language fields successfully added to Destination table' AS Status;
