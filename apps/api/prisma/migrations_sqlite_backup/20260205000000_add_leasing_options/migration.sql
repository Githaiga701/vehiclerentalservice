-- Add leasing options to Vehicle table
ALTER TABLE "Vehicle" ADD COLUMN "availableForLease" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Vehicle" ADD COLUMN "leaseMinDuration" INTEGER;
ALTER TABLE "Vehicle" ADD COLUMN "leaseMonthlyPrice" INTEGER;