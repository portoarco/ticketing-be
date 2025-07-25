-- CreateTable
CREATE TABLE "Event_Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Event_Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_Category_name_key" ON "Event_Category"("name");
