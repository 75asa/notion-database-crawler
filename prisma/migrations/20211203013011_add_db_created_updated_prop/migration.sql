/*
  Warnings:

  - Added the required column `databaseCreatedAt` to the `Database` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageCreatedAt` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Database" ADD COLUMN     "databaseCreatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "pageCreatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
