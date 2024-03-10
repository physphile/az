/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[path]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sheet_title_key" ON "Sheet"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_path_key" ON "Sheet"("path");
