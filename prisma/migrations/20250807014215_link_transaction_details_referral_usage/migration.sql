-- AlterTable
ALTER TABLE "public"."Referral_Usage" ADD COLUMN     "transaction_detail_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Referral_Usage" ADD CONSTRAINT "Referral_Usage_transaction_detail_id_fkey" FOREIGN KEY ("transaction_detail_id") REFERENCES "public"."Transactions_detail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
