// pages/api/video.js
import axios from "axios"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } else {
    try {
      const runResponse = await axios.post(
        "https://api.runpod.ai/v2/r19wiv95jb17vv/run",
        {
          webhook: `${process.env.NEXT_PUBLIC_URL}api/webhook`,
          s3Config: {
            bucketName: process.env.S3_BUCKET_NAME,
            accessId: process.env.S3_ACCESS_ID,
            accessSecret: process.env.S3_ACCESS_SECRET,
            endpointUrl: process.env.S3_ENDPOINT_URL,
          },
          input: {
            model_checkpoint: "revAnimated_v122.ckpt",
            animation_prompts: req.body.prompts,
            max_frames: 100,
            num_inference_steps: 50,
            fps: 15,
            use_init: true,
            init_image:
              "https://avatar20.s3.amazonaws.com/next-s3-uploads/000f8bd1-1038-4ca3-bddb-5901540a606a/ligr7029.jpeg",
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

      let statusData

      do {
        const statusResponse = await axios.get(
          `https://api.runpod.ai/v2/r19wiv95jb17vv/status/${runResponse.data.id}`
        )
        statusData = statusResponse.data
      } while (statusData.status === "IN_QUEUE")

      res.status(200).json(statusData)
    } catch (error) {
      console.error(error) // This will help us see the full error details
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data)
        console.error(error.response.status)
        console.error(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request)
      } else {
        // Something happened in setting up the request and triggered an Error
        console.error("Error", error.message)
      }
      res.status(500).json({error: error.message})
    }
  }
}
