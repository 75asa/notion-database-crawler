/*
  Warnings:

  - Made the column `createdAt` on table `Database` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Page` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Database" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;
