/*
  Warnings:

  - Added the required column `url` to the `Database` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_databaseId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_userId_fkey";

-- AlterTable
ALTER TABLE "Database" ADD COLUMN     "url" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Database.id_unique" RENAME TO "Database_id_key";

-- RenameIndex
ALTER INDEX "Page.id_unique" RENAME TO "Page_id_key";

-- RenameIndex
ALTER INDEX "User.id_unique" RENAME TO "User_id_key";
