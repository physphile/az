-- CreateTable
CREATE TABLE "SheetsOnSheetsets" (
    "index" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sheetId" INTEGER NOT NULL,
    "sheetsetId" INTEGER NOT NULL,

    CONSTRAINT "SheetsOnSheetsets_pkey" PRIMARY KEY ("sheetId","sheetsetId")
);

-- AddForeignKey
ALTER TABLE "SheetsOnSheetsets" ADD CONSTRAINT "SheetsOnSheetsets_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetsOnSheetsets" ADD CONSTRAINT "SheetsOnSheetsets_sheetsetId_fkey" FOREIGN KEY ("sheetsetId") REFERENCES "Sheetset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
