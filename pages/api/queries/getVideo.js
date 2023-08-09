import {fetchVideo} from '../../../queries/videos'
import {NextResponse} from 'next/server'

export default async function handler(req, res) {

  const videoId = req?.body?.videoId

  if (!videoId) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json({message: 'provide a videoId'})
  }

  try {
    const video = await fetchVideo(videoId)

    const data = res.status(200).json({
      data: {
        video,
      },
    })

    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'Something went wrong'})
  }
}
