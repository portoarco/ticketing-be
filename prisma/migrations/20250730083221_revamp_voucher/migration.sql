/*
  Warnings:

  - You are about to drop the column `limit` on the `Voucher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Voucher" DROP COLUMN "limit",
ADD COLUMN     "percentage" INTEGER,
ALTER COLUMN "amount" DROP NOT NULL;
