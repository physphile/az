/*
  Warnings:

  - A unique constraint covering the columns `[thumbnailPath]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Sheet_title_key";

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "audioPath" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "videoLink" TEXT;

-- CreateTable
CREATE TABLE "Sheetset" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "service" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sheetset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SheetToSheetset" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SheetToSheetset_AB_unique" ON "_SheetToSheetset"("A", "B");

-- CreateIndex
CREATE INDEX "_SheetToSheetset_B_index" ON "_SheetToSheetset"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_thumbnailPath_key" ON "Sheet"("thumbnailPath");

-- AddForeignKey
ALTER TABLE "_SheetToSheetset" ADD CONSTRAINT "_SheetToSheetset_A_fkey" FOREIGN KEY ("A") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SheetToSheetset" ADD CONSTRAINT "_SheetToSheetset_B_fkey" FOREIGN KEY ("B") REFERENCES "Sheetset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
