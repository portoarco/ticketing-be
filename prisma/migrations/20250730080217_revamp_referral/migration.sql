-- AlterTable
ALTER TABLE "public"."Referral_Code" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expired_at" TIMESTAMP(3);
