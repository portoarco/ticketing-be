/*
  Warnings:

  - You are about to drop the column `address` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `nik` on the `Users` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Users_nik_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "address",
DROP COLUMN "nik",
ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL;
