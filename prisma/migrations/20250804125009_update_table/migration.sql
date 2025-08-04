/*
  Warnings:

  - The values [COMPLETED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Status_new" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED');
ALTER TABLE "public"."Event_Attendees" ALTER COLUMN "status" TYPE "public"."Status_new" USING ("status"::text::"public"."Status_new");
ALTER TYPE "public"."Status" RENAME TO "Status_old";
ALTER TYPE "public"."Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Event_Reviews" ALTER COLUMN "review" DROP NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transactions" ALTER COLUMN "voucher_id" DROP NOT NULL;
