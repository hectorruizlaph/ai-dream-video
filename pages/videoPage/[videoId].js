import prisma from "../../utils/prisma"
import {useRouter} from "next/router"

export default function VideoPage({videoURL}) {
  const router = useRouter()

  // If the page is loading
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  console.log("Video URL: ", videoURL)

  return (
    <div>
      <video width="512" height="512" controls>
        <source src={videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export async function getStaticPaths() {
  const videos = await prisma.video.findMany({
    select: {
      videoId: true,
    },
  })

  const paths = videos.map((video) => ({
    params: {videoId: String(video.videoId)}, // ensure videoId is a string
  }))

  return {paths, fallback: true}
}

export async function getStaticProps({params}) {
  const video = await prisma.video.findUnique({
    where: {
      videoId: params.videoId,
    },
    select: {
      videoURL: true,
    },
  })

  return {props: {videoURL: video.videoURL}}
}
