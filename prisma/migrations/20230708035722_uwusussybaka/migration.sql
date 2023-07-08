/*
  Warnings:

  - You are about to drop the column `Address` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrls` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `indoor` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `kW` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerHour` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `selfCheckIn` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `teslaOnly` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "Address",
DROP COLUMN "description",
DROP COLUMN "imageUrls",
DROP COLUMN "indoor",
DROP COLUMN "kW",
DROP COLUMN "location",
DROP COLUMN "pricePerHour",
DROP COLUMN "selfCheckIn",
DROP COLUMN "teslaOnly",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "postId" TEXT NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "kW" INTEGER NOT NULL,
    "indoor" BOOLEAN NOT NULL,
    "pricePerHour" TEXT NOT NULL,
    "teslaOnly" BOOLEAN NOT NULL,
    "selfCheckIn" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "imageUrls" TEXT[],

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
