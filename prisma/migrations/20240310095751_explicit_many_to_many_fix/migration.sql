/*
  Warnings:

  - You are about to drop the `_SheetToSheetset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SheetToSheetset" DROP CONSTRAINT "_SheetToSheetset_A_fkey";

-- DropForeignKey
ALTER TABLE "_SheetToSheetset" DROP CONSTRAINT "_SheetToSheetset_B_fkey";

-- DropTable
DROP TABLE "_SheetToSheetset";
