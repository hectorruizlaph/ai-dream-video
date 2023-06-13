// pages/api/getAllVideos.js
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export default async function handle(req, res) {
  const allVideos = await prisma.video.findMany()
  res.json(allVideos)
}
