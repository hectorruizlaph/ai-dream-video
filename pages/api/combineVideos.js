import axios from 'axios'
import prisma from '../../utils/prisma' // ensure the path is correct
import {fetchMainVideo} from '../../queries/mainVideos'
import {fetchVideo} from '../../queries/videos'

export default async function handler(req, res) {
  // id, videoUrl, lastFrameVideo
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method not allowed'})
  }
  console.log('req.body :', req?.body)

  const id = req?.body?.id
  if (!id) {
    return res.json({message: 'Provide a main video id'})
  }

  const id2 = req?.body?.id2
  if (!id2) {
    return res.json({
      message: 'Provide a the video id that will be added to main video',
    })
  }

  const mainVideo = await fetchMainVideo(id)
  const video = await fetchVideo(id2)
  const mainVideoUrl = mainVideo?.videoURL
  const videoUrl = video?.videoURL
  const lastFrameImage = video?.lastFrameImage

  console.log('mainVideoURL :', mainVideoUrl)
  console.log('videoURL :', videoUrl)
  console.log('lastFrameImage :', lastFrameImage)

  try {
    const response = await axios.post(
      'https://express-video-ai-production.up.railway.app/api/combineVideos',
      {
        videoUrl1: mainVideoUrl,
        videoUrl2: videoUrl,
      }
    )
    const combinedVideoUrl = response?.data?.combinedVideoUrl
    console.log('combinedVideoUrl :', combinedVideoUrl)

    const newMainVideo = await prisma.mainVideo.update({
      where: {
        id: id,
      },
      data: {
        videoURL: combinedVideoUrl,
        lastFrameImage: lastFrameImage,
      },
    })

    res.status(200).json(newMainVideo)
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Something went wrong'})
  }
}
