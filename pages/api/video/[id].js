import prisma from "../../prisma/prisma"

export default async function handler(req, res) {
  const {id} = req.query

  try {
    const video = await prisma.video.findUnique({
      where: {id},
    })

    if (!video) {
      return res.status(404).json({error: "Video not found"})
    }

    // Return the video object or extract necessary data
    res.status(200).json(video)
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Internal server error"})
  }
}
