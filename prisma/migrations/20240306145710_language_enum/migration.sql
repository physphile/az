/*
  Warnings:

  - The `language` column on the `Sheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `path` to the `Sheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Sheet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('Русский', 'Церковнославянский', 'Грузинский', 'Латинский', 'Английский');

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
DROP COLUMN "language",
ADD COLUMN     "language" "Language";
