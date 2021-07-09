-- CreateTable
CREATE TABLE "Cluster" (
    "id" TEXT NOT NULL,
    "lastFetchedAt" TIMESTAMPTZ NOT NULL,
    "firstIntegratedAt" DATE NOT NULL,
    "databaseId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Database" (
    "id" TEXT NOT NULL,
    "notionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastEditedAt" TIMESTAMP(3) NOT NULL,
    "size" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "databaseId" TEXT,
    "notionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cluster_databaseId_unique" ON "Cluster"("databaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Database.notionId_unique" ON "Database"("notionId");

-- CreateIndex
CREATE UNIQUE INDEX "Page.notionId_unique" ON "Page"("notionId");

-- AddForeignKey
ALTER TABLE "Cluster" ADD FOREIGN KEY ("databaseId") REFERENCES "Database"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD FOREIGN KEY ("databaseId") REFERENCES "Database"("id") ON DELETE SET NULL ON UPDATE CASCADE;
