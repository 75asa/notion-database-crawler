-- AlterTable
ALTER TABLE "Database" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
