/*
  Warnings:

  - Changed the type of `firstIntegratedAt` on the `Database` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Database" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "lastEditedAt" SET DATA TYPE TIMESTAMPTZ,
DROP COLUMN "firstIntegratedAt",
ADD COLUMN     "firstIntegratedAt" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "name" TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ;
