/*
  Warnings:

  - You are about to drop the column `avatarURL` on the `User` table. All the data in the column will be lost.
  - Added the required column `dbCreatedAt` to the `Database` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageCreatedAt` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avatarUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Database" ADD COLUMN     "dbCreatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "pageCreatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarURL",
ADD COLUMN     "avatarUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
