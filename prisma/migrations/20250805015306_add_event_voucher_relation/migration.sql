-- AlterTable
ALTER TABLE "public"."Voucher" ADD COLUMN     "event_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
