// pages/api/video/[id].js:

import prisma from "../../../utils/prisma"

export default async function handler(req, res) {
  const {id} = req.query

  try {
    const video = await prisma.video.findUnique({
      where: {id},
    })

    if (!video) {
      return res.status(404).json({error: "Video not found"})
    }

    // Assuming the video object has a `videoUrl` property
    res.status(200).json({videoUrl: video.videoUrl})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Internal server error"})
  }
}
