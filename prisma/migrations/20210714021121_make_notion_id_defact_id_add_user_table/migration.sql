/*
  Warnings:

  - The primary key for the `Database` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `notionId` on the `Database` table. All the data in the column will be lost.
  - The primary key for the `Page` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `databaseId` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `notionId` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Database` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_databaseId_fkey";

-- DropIndex
DROP INDEX "Database.notionId_unique";

-- DropIndex
DROP INDEX "Page.notionId_unique";

-- AlterTable
ALTER TABLE "Database" DROP CONSTRAINT "Database_pkey",
DROP COLUMN "notionId";

-- AlterTable
ALTER TABLE "Page" DROP CONSTRAINT "Page_pkey",
DROP COLUMN "databaseId",
DROP COLUMN "notionId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarURL" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.id_unique" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Database.id_unique" ON "Database"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Page.id_unique" ON "Page"("id");

-- AddForeignKey
ALTER TABLE "Page" ADD FOREIGN KEY ("id") REFERENCES "Database"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
