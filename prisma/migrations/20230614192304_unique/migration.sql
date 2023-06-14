/*
  Warnings:

  - A unique constraint covering the columns `[runpodId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_runpodId_key" ON "Video"("runpodId");
