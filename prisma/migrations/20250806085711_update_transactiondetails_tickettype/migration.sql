/*
  Warnings:

  - Added the required column `ticketType_id` to the `Transactions_detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Referral_Usage" ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Transactions_detail" ADD COLUMN     "ticketType_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Voucher" ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."Transactions_detail" ADD CONSTRAINT "Transactions_detail_ticketType_id_fkey" FOREIGN KEY ("ticketType_id") REFERENCES "public"."TicketType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
