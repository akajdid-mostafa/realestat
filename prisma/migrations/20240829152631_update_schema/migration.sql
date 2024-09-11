/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `DateReserve` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DateReserve_postId_key" ON "DateReserve"("postId");
