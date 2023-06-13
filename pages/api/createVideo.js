// pages/api/createVideo.js
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export default async function handle(req, res) {
  const result = await prisma.video.create({
    data: {
      videoId: req.body.videoId,
    },
  })
  res.json(result)
}
