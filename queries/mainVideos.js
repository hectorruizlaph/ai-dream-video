import prisma from '../utils/prisma'

export const fetchAllMainVideos = async () => {
  console.log('fetchAllVideos')
  return await prisma.mainVideo.findMany()
}

export const fetchMainVideo = async (id) => {
  return await prisma.mainVideo.findUnique({
    where: {
      id: id,
    },
  })
}

export const deleteMainVideo = async (id) => {
  return await prisma.mainVideo.delete({
    where: {
      id: id,
    },
  })
}
