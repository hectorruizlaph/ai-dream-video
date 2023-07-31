import prisma from '../utils/prisma'

export const fetchAllVideos = async () => {
  return await prisma.video.findMany()
}

export const fetchVideo = async (id) => {
  return await prisma.video.findUnique({
    where: {
      id: id,
    },
  })
}
