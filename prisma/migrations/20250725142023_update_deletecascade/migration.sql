-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "Organizer" DROP CONSTRAINT "Organizer_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Organizer" ADD CONSTRAINT "Organizer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
