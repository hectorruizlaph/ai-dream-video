import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method not allowed'})
  }

  const video1Url = req.body.video1Url
  const video2Url = req.body.video2Url

  try {
    const response = await axios.post(
      'https://express-video-ai-production.up.railway.app/api/combineVideos',
      {
        video1Url: video1Url,
        video2Url: video2Url,
      }
    )

    res.status(200).json(response.data)
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Something went wrong'})
  }
}
