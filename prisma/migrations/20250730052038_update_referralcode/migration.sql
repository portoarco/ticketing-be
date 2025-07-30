/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Referral_Code` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Referral_Code_code_key" ON "public"."Referral_Code"("code");
