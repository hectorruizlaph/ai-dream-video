import {fetchVideo} from '../../../queries/videos'

export default async function handler(req, res) {
  const videoId = res?.body?.videoId

  if (!videoId) {
    res.json({message: 'provide a video id'})
  }

  try {
    const video = await fetchVideo(videoId)

    res.status(200).json({
      data: {
        video,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Something went wrong'})
  }
}
