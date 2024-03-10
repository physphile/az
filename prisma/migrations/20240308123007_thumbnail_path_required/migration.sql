/*
  Warnings:

  - Made the column `thumbnailPath` on table `Sheet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sheet" ALTER COLUMN "thumbnailPath" SET NOT NULL;
