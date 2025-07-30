/*
  Warnings:

  - You are about to drop the column `referral_code` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referrer_code]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Users_referral_code_key";

-- AlterTable
ALTER TABLE "public"."Users" DROP COLUMN "referral_code",
ADD COLUMN     "referrer_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_referrer_code_key" ON "public"."Users"("referrer_code");
