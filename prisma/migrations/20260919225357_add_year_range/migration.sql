-- AlterTable PurchasedCar: year -> yearMin/yearMax for range display 2016 - 2024
ALTER TABLE `PurchasedCar` ADD COLUMN `yearMin` INTEGER NOT NULL DEFAULT 2016;
ALTER TABLE `PurchasedCar` ADD COLUMN `yearMax` INTEGER NOT NULL DEFAULT 2024;
UPDATE `PurchasedCar` SET `yearMin` = `year`, `yearMax` = `year`;
ALTER TABLE `PurchasedCar` DROP COLUMN `year`;
ALTER TABLE `PurchasedCar` ALTER COLUMN `yearMin` DROP DEFAULT;
ALTER TABLE `PurchasedCar` ALTER COLUMN `yearMax` DROP DEFAULT;
