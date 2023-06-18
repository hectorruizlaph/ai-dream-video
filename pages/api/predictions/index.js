import Replicate from "replicate"

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// })

export default async function handler(req, res) {
  console.log("api/predictions/index.js req:", req?.body)

  const replicateKey = req.body.replicateKey
  const replicate = new Replicate({
    auth: replicateKey || process.env.REPLICATE_API_TOKEN,
  })
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    )
  }
  // if (!replicateKey) {
  //   throw new Error(
  //     "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
  //   )
  // }

  const prediction = await replicate.predictions.create({
    // Pinned to a specific version of Stable Diffusion
    // See https://replicate.com/stability-ai/stable-diffussion/versions
    version: "9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb",

    // This is the text prompt that will be submitted by a form on the frontend
    input: {
      prompt: req.body.prompt,
      num_outputs: 4,
    },
  })

  if ((res.statusCode = 500)) {
    console.log(res?.error?.message)
  }
  if (prediction?.error) {
    res.statusCode = 500
    res.end(JSON.stringify({detail: prediction.error}))
    return
  }

  prediction.replicateKey = replicateKey

  res.statusCode = 201
  res.end(JSON.stringify(prediction))
}
