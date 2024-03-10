/*
  Warnings:

  - The values [Ля-диез,Ля-бемоль,Си-бемоль,До-диез,До-бемоль,Ре-диез,Ре-бемоль,Ми-диез,Ми-бемоль,Фа-диез,Фа-бемоль,Соль-диез,Соль-бемоль] on the enum `Tonality` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "Soloist" ADD VALUE 'Бас';

-- AlterEnum
BEGIN;
CREATE TYPE "Tonality_new" AS ENUM ('Ля♯', 'Ля', 'Ля♭', 'Си♭', 'Си', 'До♯', 'До', 'До♭', 'Ре♯', 'Ре', 'Ре♭', 'Ми♯', 'Ми', 'Ми♭', 'Фа♯', 'Фа', 'Фа♭', 'Соль♯', 'Соль', 'Соль♭');
ALTER TABLE "Sheet" ALTER COLUMN "tonality" TYPE "Tonality_new" USING ("tonality"::text::"Tonality_new");
ALTER TYPE "Tonality" RENAME TO "Tonality_old";
ALTER TYPE "Tonality_new" RENAME TO "Tonality";
DROP TYPE "Tonality_old";
COMMIT;
