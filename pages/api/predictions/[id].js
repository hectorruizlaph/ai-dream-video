import Replicate from 'replicate'

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// })

export default async function handler(req, res) {
  const origin = req.headers.get('origin')

  console.log('api/predictions/[id].js req:', req?.body)

  const replicateKey = req.body.replicateKey || process.env.REPLICATE_API_TOKEN
  const replicate = new Replicate({
    auth: replicateKey || process.env.REPLICATE_API_TOKEN,
  })

  const prediction = await replicate.predictions.get(req.query.id)

  if (prediction?.error) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.end(JSON.stringify({detail: prediction.error}))
    return
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify(prediction))
}
