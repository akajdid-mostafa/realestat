/*
  Warnings:

  - You are about to drop the column `alldetaille` on the `Detail` table. All the data in the column will be lost.
  - You are about to drop the column `table` on the `Post` table. All the data in the column will be lost.
  - Added the required column `title` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Detail" DROP COLUMN "alldetaille",
ADD COLUMN     "BALCONY" TEXT,
ADD COLUMN     "CONSTRUCTIONYEAR" TEXT,
ADD COLUMN     "DOCUMENTS" TEXT,
ADD COLUMN     "ELEVATOR" TEXT,
ADD COLUMN     "FACADE" TEXT,
ADD COLUMN     "FLOOR" TEXT,
ADD COLUMN     "FURNISHED" TEXT,
ADD COLUMN     "PARKING" TEXT,
ADD COLUMN     "POOL" TEXT,
ADD COLUMN     "ROOMS" TEXT,
ADD COLUMN     "SURFACEm2" TEXT,
ADD COLUMN     "bathrooms" TEXT,
ADD COLUMN     "bedromms" TEXT,
ADD COLUMN     "kitchen" TEXT,
ADD COLUMN     "livingRooms" TEXT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "table",
ADD COLUMN     "title" TEXT NOT NULL;
