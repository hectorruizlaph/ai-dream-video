import prisma from "../../utils/prisma"
import axios from "axios"

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const animationPrompts = req.body.animationPrompts
      const initImage = req.body.initImage

      // Make the API call to start the video generation process
      const response = await axios.post(
        "https://api.runpod.ai/v2/r19wiv95jb17vv/run",
        {
          s3Config: {
            bucketName: process.env.S3_BUCKET_NAME,
            accessId: process.env.S3_ACCESS_ID,
            accessSecret: process.env.S3_ACCESS_SECRET,
            endpointUrl: process.env.S3_ENDPOINT_URL,
          },
          input: {
            model_checkpoint: "revAnimated_v122.ckpt",
            animation_prompts:
              animationPrompts ||
              "0: a beautiful apple, trending on Artstation | 25: a beautiful banana, trending on Artstation",
            max_frames: 50,
            num_inference_steps: 50,
            fps: 15,
            use_init: true,
            init_image:
              initImage ||
              "https://replicate.delivery/pbxt/XgwJVVHDIDJKKddxTa8teF5Qcgfwj4Ba7EUsqaQRNN1g5qFRA/out-0.png",
            animation_mode: "3D",
            zoom: "0:(1)",
            translation_x: "0:(0)",
            strength_schedule: "0: (0.9)",
          },
        },
        {
          headers: {
            Authorization: process.env.RUNPOD_AUTHORIZATION,
          },
        }
      )

      // Save the runpodId to the Video model using Prisma
      const video = await prisma.video.create({
        data: {
          runpodId: response.data.id,
        },
      })

      let videoId = null

      while (!videoId) {
        const statusResponse = await axios.get(
          `https://api.runpod.ai/v2/r19wiv95jb17vv/status/${video.runpodId}`
        )

        const status = statusResponse.data.status

        if (status === "COMPLETED") {
          videoId = getVideoIdFromUrl(statusResponse.data.output.file_url)
        } else {
          // Wait for 4 seconds before checking the status again
          await sleep(4000)
        }
      }

      // Update the videoId field in the Video model
      await prisma.video.update({
        where: {id: video.id},
        data: {videoId},
      })

      res.status(200).json({success: true})
    } catch (error) {
      console.error("Failed to start animation:", error)
      res.status(500).json({error: "Failed to start animation."})
    }
  } else {
    res.status(405).json({error: "Method not allowed."})
  }
}

const getVideoIdFromUrl = (videoUrl) => {
  const parts = videoUrl.split("/")
  return parts[parts.length - 1].split("?")[0]
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
