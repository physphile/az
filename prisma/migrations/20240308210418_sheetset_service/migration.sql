/*
  Warnings:

  - The `service` column on the `Sheetset` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Sheetset" DROP COLUMN "service",
ADD COLUMN     "service" "Service";
