/*
  Warnings:

  - Changed the type of `firstIntegratedAt` on the `Cluster` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Cluster" DROP COLUMN "firstIntegratedAt",
ADD COLUMN     "firstIntegratedAt" TIMETZ NOT NULL;
