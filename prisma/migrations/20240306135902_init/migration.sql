-- CreateEnum
CREATE TYPE "Key" AS ENUM ('Мажор', 'Минор');

-- CreateEnum
CREATE TYPE "Service" AS ENUM ('Литургия', 'Вечерня', 'Утреня', 'Повечерие');

-- CreateEnum
CREATE TYPE "Choir" AS ENUM ('Смешанный хор', 'Мужской хор', 'Женский хор', 'Детский хор', 'Два хора');

-- CreateEnum
CREATE TYPE "Soloist" AS ENUM ('Сопрано', 'Альт', 'Тенор', 'Баритон', 'Бас профундо', 'Несколько солистов');

-- CreateTable
CREATE TABLE "Sheet" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "arranger" TEXT,
    "typesetter" TEXT,
    "variant" TEXT,
    "tonality" TEXT,
    "writtenIn" INTEGER,
    "key" "Key",
    "language" TEXT,
    "translit" TEXT,
    "holiday" TEXT,
    "service" "Service",
    "text" TEXT,
    "alias" TEXT,
    "choir" "Choir",
    "voices" INTEGER,
    "book" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);
