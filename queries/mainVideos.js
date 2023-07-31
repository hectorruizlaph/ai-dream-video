import prisma from '../utils/prisma'

export const fetchAllMainVideos = async () => {
  return await prisma.mainVideo.findMany()
}

export const fetchMainVideo = async (id) => {
  return await prisma.mainVideo.findUnique({
    where: {
      id: id,
    },
  })
}
