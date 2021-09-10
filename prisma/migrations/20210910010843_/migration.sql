/*
  Warnings:

  - You are about to drop the column `lastFetchedAt` on the `Database` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Database" DROP COLUMN "lastFetchedAt";
