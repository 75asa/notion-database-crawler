/*
  Warnings:

  - You are about to drop the `Cluster` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstIntegratedAt` to the `Database` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastFetchedAt` to the `Database` table without a default value. This is not possible if the table is not empty.
  - Made the column `databaseId` on table `Page` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Cluster" DROP CONSTRAINT "Cluster_databaseId_fkey";

-- AlterTable
ALTER TABLE "Database" ADD COLUMN     "firstIntegratedAt" TIMETZ NOT NULL,
ADD COLUMN     "lastFetchedAt" TIMESTAMPTZ NOT NULL,
ALTER COLUMN "size" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "databaseId" SET NOT NULL;

-- DropTable
DROP TABLE "Cluster";
