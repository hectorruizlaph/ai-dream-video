-- CreateTable
CREATE TABLE "MainVideo" (
    "id" SERIAL NOT NULL,
    "runpodId" TEXT NOT NULL,
    "mainVideoId" TEXT,
    "lastFrameImage" TEXT,
    "videoURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MainVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MainVideo_runpodId_key" ON "MainVideo"("runpodId");

-- CreateIndex
CREATE UNIQUE INDEX "MainVideo_mainVideoId_key" ON "MainVideo"("mainVideoId");

-- CreateIndex
CREATE UNIQUE INDEX "MainVideo_lastFrameImage_key" ON "MainVideo"("lastFrameImage");

-- CreateIndex
CREATE UNIQUE INDEX "MainVideo_videoURL_key" ON "MainVideo"("videoURL");
