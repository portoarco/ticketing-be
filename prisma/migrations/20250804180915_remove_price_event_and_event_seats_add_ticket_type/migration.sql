/*
  Warnings:

  - You are about to drop the column `price` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the `Event_Seat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Event_Seat" DROP CONSTRAINT "Event_Seat_events_id_fkey";

-- AlterTable
ALTER TABLE "public"."Events" DROP COLUMN "price";

-- DropTable
DROP TABLE "public"."Event_Seat";

-- CreateTable
CREATE TABLE "public"."TicketType" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TicketType" ADD CONSTRAINT "TicketType_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
