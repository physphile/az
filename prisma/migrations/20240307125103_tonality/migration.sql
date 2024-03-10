/*
  Warnings:

  - The `tonality` column on the `Sheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "tonality",
ADD COLUMN     "tonality" "Tonality";
