-- AlterTable
ALTER TABLE "public"."Voucher" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "organizer_id" DROP NOT NULL;
