import axios from "axios"
import prisma from "../../utils/prisma"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({message: "Method not allowed"})
  }

  const animationPrompts = req.body.animationPrompts
  const initImage = req.body.initImage

  try {
    const response = await axios.post(
      "https://api.runpod.ai/v2/r19wiv95jb17vv/run",
      {
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
          zoom: "0:(0)",
          translation_x: "0:(0)",
          strength_schedule: "0: (0.9)",
          guidance_scale: 7,
          width: 512,
          height: 512,
        },
        s3Config: {
          bucketName: process.env.S3_BUCKET_NAME,
          accessId: process.env.S3_ACCESS_ID,
          accessSecret: process.env.S3_ACCESS_SECRET,
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

    const runpodId = response.data.id
    console.log("Runpod ID:", runpodId)

    await prisma.video.create({
      data: {
        runpodId: runpodId,
      },
    })

    let statusResponse = null
    do {
      await new Promise((r) => setTimeout(r, 10000))
      statusResponse = await axios.get(
        `https://api.runpod.ai/v2/r19wiv95jb17vv/status/${runpodId}`,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: process.env.RUNPOD_AUTHORIZATION,
          },
        }
      )
      console.log("Status:", statusResponse.data.status)
    } while (statusResponse.data.status === "IN_PROGRESS")

    if (statusResponse.data.status === "COMPLETED") {
      let fullUrl = statusResponse.data.output.file_url
      console.log("fullUrl:", fullUrl)

      // remove everything after ?
      fullUrl = fullUrl.split("?")[0]

      const videoId = fullUrl.split("/").pop().split(".")[0]
      console.log("videoId:", videoId)

      await prisma.video.update({
        where: {runpodId: runpodId},
        data: {
          videoId: videoId,
          videoURL: fullUrl, // Save the clean video URL
        },
      })

      console.log("Video ID and URL saved:", videoId, fullUrl)
    }

    res.status(200).json({message: "Video creation process completed"})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Something went wrong"})
  }
}
