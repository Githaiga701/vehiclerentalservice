-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "category" TEXT NOT NULL,
    "transmission" TEXT,
    "fuelType" TEXT,
    "seats" INTEGER,
    "engineSize" TEXT,
    "mileage" INTEGER,
    "dailyPrice" INTEGER,
    "weeklyDiscount" INTEGER DEFAULT 0,
    "monthlyDiscount" INTEGER DEFAULT 0,
    "monthlyPrice" INTEGER,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "features" TEXT,
    "images" TEXT,
    "documents" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "withDriver" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vehicle" ("category", "createdAt", "dailyPrice", "description", "fuelType", "id", "images", "isAvailable", "location", "monthlyPrice", "ownerId", "seats", "title", "transmission", "updatedAt", "withDriver", "year") SELECT "category", "createdAt", "dailyPrice", "description", "fuelType", "id", "images", "isAvailable", "location", "monthlyPrice", "ownerId", "seats", "title", "transmission", "updatedAt", "withDriver", "year" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
CREATE INDEX "Vehicle_ownerId_idx" ON "Vehicle"("ownerId");
CREATE INDEX "Vehicle_category_idx" ON "Vehicle"("category");
CREATE INDEX "Vehicle_location_idx" ON "Vehicle"("location");
CREATE INDEX "Vehicle_status_idx" ON "Vehicle"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
