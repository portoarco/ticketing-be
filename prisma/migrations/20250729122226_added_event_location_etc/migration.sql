/*
  Warnings:

  - A unique constraint covering the columns `[refferal_code]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Events" ALTER COLUMN "event_category_id" SET DATA TYPE TEXT,
ALTER COLUMN "event_location_id" SET DATA TYPE TEXT,
ALTER COLUMN "end_date" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Event_Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Event_Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_Location_name_key" ON "Event_Location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_refferal_code_key" ON "Users"("refferal_code");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_event_category_id_fkey" FOREIGN KEY ("event_category_id") REFERENCES "Event_Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_event_location_id_fkey" FOREIGN KEY ("event_location_id") REFERENCES "Event_Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
