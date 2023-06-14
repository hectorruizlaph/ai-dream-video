import {useEffect, useState} from "react"
import axios from "axios"

export default function AllVideos() {
  const [videoUrls, setVideoUrls] = useState([])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/allvideos")
        const videoUrls = response.data.videoUrls
        setVideoUrls(videoUrls)

        // Fetch the final video ID for each video after a delay
        const videoIds = await Promise.all(
          videoUrls.map(async (videoUrl) => {
            const videoId = await getFinalVideoId(videoUrl)
            return videoId
          })
        )

        console.log("Final Video IDs:", videoIds)
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      }
    }

    fetchVideos()
  }, [])

  const getFinalVideoId = async (videoUrl) => {
    const statusUrl = `https://api.runpod.ai/v2/bbjho7b2sbjsdr/status/${getVideoIdFromUrl(
      videoUrl
    )}`

    let videoId = null

    while (!videoId) {
      const response = await axios.get(statusUrl)
      videoId = response.data.videoId

      // Wait for 4 seconds before checking the status again
      await sleep(4000)
    }

    return videoId
  }

  const getVideoIdFromUrl = (videoUrl) => {
    const parts = videoUrl.split("/")
    return parts[parts.length - 1].split("?")[0]
  }

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  return (
    <div>
      {videoUrls.map((videoUrl, index) => (
        <video key={index} controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ))}
    </div>
  )
}
