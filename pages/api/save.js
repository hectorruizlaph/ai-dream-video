import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export default async (req, res) => {
  const {id} = req.body

  try {
    await prisma.video.create({
      data: {
        videoId: id,
      },
    })

    res.status(200).json({message: "Video ID saved successfully."})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Failed to save video ID."})
  } finally {
    await prisma.$disconnect()
  }
}
