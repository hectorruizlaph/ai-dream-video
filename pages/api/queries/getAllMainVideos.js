import {fetchAllMainVideos} from '../../../queries/mainVideos'

export default async function handler(req, res) {
  console.log('|||||||||||||||||||||||||||')
  const origin = req.headers.get('origin')
  const origin2 = req.headers['origin']
  console.log('origin :', origin)
  console.log('origin2 :', origin2)

  try {
    const allMainVideos = await fetchAllMainVideos()
    res.setHeader('Access-Control-Allow-Origin', '*')

    return res.status(200).json({
      data: {
        allMainVideos,
      },
    })
  } catch (error) {
    console.error(error)
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(500).json({message: 'Something went wrong'})
  }
}
