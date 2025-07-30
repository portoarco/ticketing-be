/*
  Warnings:

  - A unique constraint covering the columns `[refferal_code]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Users_referrer_code_key";

-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "refferal_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_refferal_code_key" ON "public"."Users"("refferal_code");
