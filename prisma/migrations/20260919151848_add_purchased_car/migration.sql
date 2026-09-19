-- CreateTable
CREATE TABLE `PurchasedCar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `priceMin` INTEGER NOT NULL,
    `priceMax` INTEGER NOT NULL,
    `category` ENUM('MPV', 'CITY_CAR', 'LCGC', 'SUV') NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PurchasedCar_category_idx`(`category`),
    INDEX `PurchasedCar_isPublished_idx`(`isPublished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
