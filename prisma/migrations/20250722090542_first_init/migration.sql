-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "nik" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_nik_key" ON "Users"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
