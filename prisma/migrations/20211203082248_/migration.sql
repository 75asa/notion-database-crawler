/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Database` table. All the data in the column will be lost.
  - You are about to drop the column `databaseCreatedAt` on the `Database` table. All the data in the column will be lost.
  - You are about to drop the column `lastEditedAt` on the `Database` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `databaseID` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `pageCreatedAt` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `avatarURL` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `database_created_at` to the `Database` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_edited_at` to the `Database` table without a default value. This is not possible if the table is not empty.
  - Added the required column `database_id` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page_created_at` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatar_url` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_databaseID_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_userId_fkey";

-- AlterTable
ALTER TABLE "Database" DROP COLUMN "createdAt",
DROP COLUMN "databaseCreatedAt",
DROP COLUMN "lastEditedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "database_created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "last_edited_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "createdAt",
DROP COLUMN "databaseID",
DROP COLUMN "pageCreatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "database_id" TEXT NOT NULL,
ADD COLUMN     "page_created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarURL",
DROP COLUMN "updatedAt",
ADD COLUMN     "avatar_url" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "Database"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
