-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'PAID', 'REJECTED', 'CANCELED');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "phone_number" TEXT NOT NULL,
    "avatar" TEXT,
    "referral_code" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organizer" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Articles" (
    "id" TEXT NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Events" (
    "id" TEXT NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "event_category_id" TEXT NOT NULL,
    "event_location_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event_Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Event_Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event_Location" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Event_Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event_Seat" (
    "id" TEXT NOT NULL,
    "events_id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Event_Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event_Reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "events_id" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event_Attendees" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL,

    CONSTRAINT "Event_Attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Referral_Code" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "Referral_Code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Referral_Usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "referral_code_id" TEXT NOT NULL,
    "used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_Usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Voucher" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "limit" INTEGER NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transactions" (
    "id" TEXT NOT NULL,
    "voucher_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "proof" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transactions_detail" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "transaction_status" "public"."TransactionStatus" NOT NULL,

    CONSTRAINT "Transactions_detail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_referral_code_key" ON "public"."Users"("referral_code");

-- CreateIndex
CREATE UNIQUE INDEX "Event_Category_name_key" ON "public"."Event_Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Event_Seat_events_id_key" ON "public"."Event_Seat"("events_id");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_Code_user_id_key" ON "public"."Referral_Code"("user_id");

-- AddForeignKey
ALTER TABLE "public"."Organizer" ADD CONSTRAINT "Organizer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Events" ADD CONSTRAINT "Events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Events" ADD CONSTRAINT "Events_event_category_id_fkey" FOREIGN KEY ("event_category_id") REFERENCES "public"."Event_Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Events" ADD CONSTRAINT "Events_event_location_id_fkey" FOREIGN KEY ("event_location_id") REFERENCES "public"."Event_Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Seat" ADD CONSTRAINT "Event_Seat_events_id_fkey" FOREIGN KEY ("events_id") REFERENCES "public"."Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Reviews" ADD CONSTRAINT "Event_Reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Reviews" ADD CONSTRAINT "Event_Reviews_events_id_fkey" FOREIGN KEY ("events_id") REFERENCES "public"."Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Attendees" ADD CONSTRAINT "Event_Attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event_Attendees" ADD CONSTRAINT "Event_Attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Referral_Code" ADD CONSTRAINT "Referral_Code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Referral_Usage" ADD CONSTRAINT "Referral_Usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Referral_Usage" ADD CONSTRAINT "Referral_Usage_referral_code_id_fkey" FOREIGN KEY ("referral_code_id") REFERENCES "public"."Referral_Code"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voucher" ADD CONSTRAINT "Voucher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "public"."Voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions_detail" ADD CONSTRAINT "Transactions_detail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions_detail" ADD CONSTRAINT "Transactions_detail_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."Transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions_detail" ADD CONSTRAINT "Transactions_detail_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions_detail" ADD CONSTRAINT "Transactions_detail_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
