/*
  Warnings:

  - You are about to drop the column `path` on the `Sheet` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Sheet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[filePath]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filePath` to the `Sheet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Sheet_path_key";

-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "path",
DROP COLUMN "thumbnail",
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "thumbnailPath" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_filePath_key" ON "Sheet"("filePath");
