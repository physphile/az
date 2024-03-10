/*
  Warnings:

  - The `translit` column on the `Sheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "translit",
ADD COLUMN     "translit" "Language";
