import {fetchAllVideos} from '../../../queries/videos'

export default async function handler(req, res) {
  const origin = req.headers.get('origin')

  try {
    const allVideos = await fetchAllVideos()
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(200).json({
      data: {
        allVideos,
      },
    })
  } catch (error) {
    console.error(error)
  res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(500).json({message: 'Something went wrong'})
  }
}
