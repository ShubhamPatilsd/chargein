/*
  Warnings:

  - Added the required column `location` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "location" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSeller" BOOLEAN DEFAULT false,
ADD COLUMN     "onboardingComplete" BOOLEAN;
