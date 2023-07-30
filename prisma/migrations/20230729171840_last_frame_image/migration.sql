/*
  Warnings:

  - A unique constraint covering the columns `[lastFrameImage]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "lastFrameImage" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Video_lastFrameImage_key" ON "Video"("lastFrameImage");
