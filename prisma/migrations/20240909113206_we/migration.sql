/*
  Warnings:

  - Made the column `fullName` on table `DateReserve` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CIN` on table `DateReserve` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `DateReserve` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DateReserve" ALTER COLUMN "fullName" SET NOT NULL,
ALTER COLUMN "CIN" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL;
