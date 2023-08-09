import {fetchAllMainVideos} from '../../../queries/mainVideos'

export default async function handler(req, res) {
  try {
    const allMainVideos = await fetchAllMainVideos()
    // res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(200).json({
      data: {
        allMainVideos,
      },
    })
  } catch (error) {
    console.error(error)
    // res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(500).json({message: 'Something went wrong'})
  }
}
