/*
  Warnings:

  - You are about to alter the column `status` on the `offer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `offer` MODIFY `status` ENUM('BARU', 'DIPROSES', 'SELESAI', 'BATAL') NOT NULL DEFAULT 'BARU';
