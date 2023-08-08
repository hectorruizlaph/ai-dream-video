// pages/api/video/[videoId].js
import prisma from "../../../utils/prisma"

export default async function handler(req, res) {
  const origin = req.headers.get('origin')

  const {videoId} = req.query

  const video = await prisma.video.findUnique({
    where: {videoId: videoId},
    select: {videoURL: true},
  })

  if (video) {
  res.setHeader('Access-Control-Allow-Origin', '*')

    res.redirect(301, `/videoPage/${videoId}`)
  } else {
  res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(404).send("Video not found")
  }
}
