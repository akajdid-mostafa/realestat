/*
  Warnings:

  - Added the required column `updatedAt` to the `DateReserve` table without a default value. This is not possible if the table is not empty.
  - Made the column `fullName` on table `DateReserve` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CIN` on table `DateReserve` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `DateReserve` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DateReserve" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "fullName" SET NOT NULL,
ALTER COLUMN "CIN" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;
