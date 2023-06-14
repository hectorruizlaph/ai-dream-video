import axios from "axios"
import prisma from "../../utils/prisma"

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const animationPrompts = req.body.animationPrompts
      const initImage = req.body.initImage

      // Make the API call to run the video generation
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
            "Content-Type": "application/json",
            Authorization: process.env.RUNPOD_AUTHORIZATION,
          },
        }
      )

      // Extract the video ID from the response
      const videoId = response.data.id

      // Save the videoId to the Video model using Prisma
      const video = await prisma.video.create({
        data: {
          videoId: videoId,
        },
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
