-- CreateEnum
CREATE TYPE "Tonality" AS ENUM ('Ля-диез', 'Ля', 'Ля-бемоль', 'Си-бемоль', 'Си', 'До-диез', 'До', 'До-бемоль', 'Ре-диез', 'Ре', 'Ре-бемоль', 'Ми-диез', 'Ми', 'Ми-бемоль', 'Фа-диез', 'Фа', 'Фа-бемоль', 'Соль-диез', 'Соль', 'Соль-бемоль');

-- AlterTable
ALTER TABLE "Sheet" ALTER COLUMN "thumbnail" DROP NOT NULL;
