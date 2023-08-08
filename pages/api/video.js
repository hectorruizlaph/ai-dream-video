import axios from 'axios'
import prisma from '../../utils/prisma'
import {NextResponse} from 'next/server'

export default async function handler(req, res) {
  const origin = req.headers.get('origin')
  console.log('origin: ', origin)
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method not allowed'})
  }

  // console.log('||||||||||| api/video.js api :', req)

  const animationPrompts = req.body.animationPrompts
  const initImage = req.body.initImage
  const isMainVideo = req?.body?.isMainVideo || false

  console.log('animationPrompts :', animationPrompts, 'initImage :', initImage)

  let videoId, cleanFullUrl

  try {
    const response = await axios.post(
      // 'https://api.runpod.ai/v2/r19wiv95jb17vv/run',
      'https://api.runpod.ai/v2/ysw8mgd9gu2ryd/run',
      {
        input: {
          model_checkpoint: 'revAnimated_v122.ckpt',
          sampler: 'euler_ancestral',
          strength: 1,
          animation_prompts: String(animationPrompts),
          // || "25: a beautiful banana | 50: an astronaut | 75: an astronaut in Mars",
          // "0: a beautiful banana | 5: an astronaut | 10: an astronaut in Mars",
          max_frames: 100,
          num_inference_steps: 25,
          fps: 15,
          use_init: true,
          init_image: String(initImage),
          animation_mode: '3D',
          zoom: '0:(1.00)',
          translation_x: '0:(0)',
          translation_y: '0:(0)',
          translation_z: '0:(0)',
          // strength_schedule: "0: (0.9), 25: (0.65), 50: (0.65), 75: (0.65)",
          strength_schedule: '0: (0.99), 1: (0.99), 5: (0.70), 100: (0.70)',
          guidance_scale: 7,
          width: 512,
          height: 512,
          noise_schedule: '0: (-0.06*(cos(3.141*t/15)**100)+0.06)',
          kernel_schedule: '0: (5)',
          sigma_schedule: '0: (1.0)',
          amount_schedule: '0: (0.05)',
          threshold_schedule: '0: (0.0)',
          diffusion_cadence: 2,
          use_depth_warping: true,
          border: 'wrap',
          midas_weight: 0.2,
          padding_mode: 'border',
          sampling_mode: 'bicubic',
          fov: 120,
          perspective_flip_phi: '0:(0)',
          perspective_flip_fv: '0:(0)',
        },
        s3Config: {
          bucketName: process.env.S3_UPLOAD_BUCKET,
          accessId: process.env.S3_UPLOAD_KEY,
          accessSecret: process.env.S3_UPLOAD_SECRET,
          endpointUrl: process.env.S3_ENDPOINT_URL,
        },
      },
      {
        headers: {
          //   "Content-Type": "application/json",
          Authorization: process.env.RUNPOD_AUTHORIZATION,
        },
      }
    )

    // console.log('response:', response)
    // console.log('response?.data:', response?.data)
    console.log('response?.data?.id:', response?.data?.id)
    const runpodId = response.data.id

    if (isMainVideo) {
      await prisma.mainVideo.create({
        data: {
          runpodId: runpodId,
        },
      })
    } else {
      await prisma.video.create({
        data: {
          runpodId: runpodId,
        },
      })
    }

    let statusResponse = null
    do {
      await new Promise((r) => setTimeout(r, 10000))
      statusResponse = await axios.get(
        `https://api.runpod.ai/v2/ysw8mgd9gu2ryd/status/${runpodId}`,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: process.env.RUNPOD_AUTHORIZATION,
          },
        }
      )
      console.log('Status:', statusResponse.data.status)
    } while (
      statusResponse.data.status === 'IN_PROGRESS' ||
      statusResponse.data.status === 'IN_QUEUE'
    )

    if (statusResponse.data.status === 'COMPLETED') {
      let fullUrl = statusResponse.data.output.file_url

      cleanFullUrl = fullUrl.split('?')[0]
      console.log('cleanFullUrl:', cleanFullUrl)

      videoId = cleanFullUrl.split('/').pop().split('.')[0]
      console.log('videoId:', videoId)

      console.log('Video ID and URL saved:', videoId, fullUrl)

      console.log(
        'videoURL:',
        `${process.env.S3_ENDPOINT_URL}/${process.env.S3_UPLOAD_BUCKET}/${videoId}.mp4`
      )

      const videoURL = `${process.env.S3_ENDPOINT_URL}/${process.env.S3_UPLOAD_BUCKET}/${videoId}.mp4`

      const lastFrameResponse = await axios.post(
        'https://express-video-ai-production.up.railway.app/api/processVideo',
        {
          videoUrl: cleanFullUrl,
        }
      )

      const lastFrameImageUrl = lastFrameResponse.data.lastFrameImageUrl

      console.log('lastFrameImageUrl :', lastFrameImageUrl)

      if (isMainVideo) {
        await prisma.mainVideo.update({
          where: {runpodId: runpodId},
          data: {
            mainVideoId: videoId,
            videoURL: String(cleanFullUrl), // Save the clean video URL
            lastFrameImage: String(lastFrameImageUrl), // Save the clean video URL
          },
        })
      } else {
        await prisma.video.update({
          where: {runpodId: runpodId},
          data: {
            videoId: videoId,
            videoURL: String(cleanFullUrl), // Save the clean video URL
            lastFrameImage: String(lastFrameImageUrl), // Save the clean video URL
          },
        })
      }

      res.status(200).json({
        message: 'Video creation process completed',
        data: {
          runpodId: statusResponse.data.id,
          status: statusResponse.data.status,
          videoId: String(videoId),
          videoURL: videoURL,
          lastFrameImage: lastFrameImageUrl,
        },
      })
      return new NextResponse(JSON.stringify(res), {
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Content-Type': 'application/json',
        },
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Something went wrong'})
  }
}
