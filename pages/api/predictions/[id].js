import Replicate from "replicate"

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// })

export default async function handler(req, res) {
  console.log("api/predictions/[id].js req:", req?.body)

  const replicateKey = req.body.replicateKey
  const replicate = new Replicate({
    auth: replicateKey,
  })

  const prediction = await replicate.predictions.get(req.query.id)

  if (prediction?.error) {
    res.statusCode = 500
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({detail: prediction.error}))
    return
  }

  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(prediction))
}
