/*
  Warnings:

  - You are about to drop the column `databaseId` on the `Page` table. All the data in the column will be lost.
  - Added the required column `databaseID` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_databaseId_fkey";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "databaseId",
ADD COLUMN     "databaseID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_databaseID_fkey" FOREIGN KEY ("databaseID") REFERENCES "Database"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
