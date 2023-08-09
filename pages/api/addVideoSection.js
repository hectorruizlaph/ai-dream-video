import axios from 'axios'
import prisma from '../../utils/prisma' // ensure the path is correct

export default async function handler(req, res) {
  const videoId = req?.body?.videoId
  if (!videoId) {
    return res.status(403).json({message: 'provide videoId'})
  }

  const videoUrl1 = req?.body?.videoUrl1
  const videoUrl2 = req?.body?.videoUrl2
  const lastFrameVideo2 = req?.body?.lastFrameVideo2

  try {
    const response = await axios.post(
      'https://express-video-ai-production.up.railway.app/api/combineVideos',
      {
        videoUrl1: videoUrl1,
        videoUrl2: videoUrl2,
      }
    )

    const newMainVideo = await prisma.mainVideo.create({
      data: {
        combinedVideoUrl: response.data.combinedVideoUrl,
        lastFrameImage: lastFrameVideo2,
      },
    })
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(200).json(newMainVideo)
  } catch (error) {
    console.error(error)
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(500).json({message: 'Something went wrong'})
  }
}
