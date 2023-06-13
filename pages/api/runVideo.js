import axios from "axios"

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {animationPrompts, initImage} = req.body

      const response = await axios.post(
        "https://api.runpod.ai/v2/r19wiv95jb17vv/run",
        {
          webhook: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
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
          headers: {Authorization: process.env.RUNPOD_AUTHORIZATION},
        }
      )

      res.status(200).json(response.data)
    } catch (error) {
      console.error(error)
      res.status(500).json({error: "Error running video generation."})
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
