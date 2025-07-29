/*
  Warnings:

  - You are about to drop the column `name` on the `Event_Location` table. All the data in the column will be lost.
  - Added the required column `address` to the `Event_Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Event_Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Event_Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Event_Location_name_key";

-- AlterTable
ALTER TABLE "Event_Location" DROP COLUMN "name",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "event_id" TEXT NOT NULL;
