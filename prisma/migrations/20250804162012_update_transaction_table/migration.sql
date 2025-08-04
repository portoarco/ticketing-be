/*
  Warnings:

  - You are about to drop the column `price` on the `Transactions_detail` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `Transactions_detail` table. All the data in the column will be lost.
  - You are about to drop the `Transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Transactions" DROP CONSTRAINT "Transactions_voucher_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transactions_detail" DROP CONSTRAINT "Transactions_detail_transaction_id_fkey";

-- AlterTable
ALTER TABLE "public"."Transactions_detail" DROP COLUMN "price",
DROP COLUMN "transaction_id",
ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "proof" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "voucher_id" TEXT;

-- DropTable
DROP TABLE "public"."Transactions";

-- AddForeignKey
ALTER TABLE "public"."Articles" ADD CONSTRAINT "Articles_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions_detail" ADD CONSTRAINT "Transactions_detail_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "public"."Voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
