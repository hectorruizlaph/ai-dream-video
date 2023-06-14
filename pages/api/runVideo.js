import axios from "axios"
import prisma from "../../utils/prisma"

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const animationPrompts = req.body.animationPrompts
      const initImage = req.body.initImage

      // Make the API call to run the video generation
      const response = await axios.post(
        "https://api.runpod.ai/v2/bbjho7b2sbjsdr/run",
        {
          s3Config: {
            bucketName: process.env.S3_BUCKET_NAME,
            accessId: process.env.S3_ACCESS_ID,
            accessSecret: process.env.S3_ACCESS_SECRET,
            endpointUrl: process.env.S3_ENDPOINT_URL,
          },
          input: {
            model_checkpoint: "revAnimated_v122.ckpt",
            animation_prompts: animationPrompts,
            max_frames: 50,
            num_inference_steps: 50,
            fps: 15,
            use_init: true,
            init_image: initImage,
            animation_mode: "3D",
            zoom: "0:(1)",
            translation_x: "0:(0)",
            strength_schedule: "0: (0.9)",
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
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
          const fileUrl = statusResponse.data.output.file_url
          videoId = extractVideoIdFromUrl(fileUrl)
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

      res.status(200).json(video)
    } catch (error) {
      console.error("Failed to start animation:", error)
      res.status(500).json({error: "Error running video generation."})
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

function extractVideoIdFromUrl(fileUrl) {
  const parts = fileUrl.split("/")
  const fileId = parts[parts.length - 1].split("?")[0]
  return fileId
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
