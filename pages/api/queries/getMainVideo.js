import {fetchMainVideo} from '../../../queries/videos'

export default async function handler(req, res) {
  const videoId = req?.body?.videoId

  if (!videoId) {
    rer.json({message: 'provide a videoId'})
  }

  try {
    const video = await fetchMainVideo(videoId)
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(200).json({
      data: {
        video,
      },
    })
  } catch (error) {
    console.error(error)
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(500).json({message: 'Something went wrong'})
  }
}
