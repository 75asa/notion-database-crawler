/*
  Warnings:

  - You are about to drop the column `firstIntegratedAt` on the `Database` table. All the data in the column will be lost.
  - Made the column `name` on table `Database` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Page` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Page` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Database" DROP COLUMN "firstIntegratedAt",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;
