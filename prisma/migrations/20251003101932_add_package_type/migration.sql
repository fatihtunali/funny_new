-- AlterTable
ALTER TABLE `package` ADD COLUMN `packageType` VARCHAR(191) NOT NULL DEFAULT 'WITH_HOTEL',
    MODIFY `hotels` TEXT NULL;

-- CreateIndex
CREATE INDEX `Package_packageType_idx` ON `Package`(`packageType`);
