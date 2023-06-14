import {useEffect, useState} from "react"
import axios from "axios"

export default function AllVideos() {
  const [videoUrls, setVideoUrls] = useState([])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/allvideos")
        setVideoUrls(response.data.videoUrls)
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      }
    }

    fetchVideos()
  }, [])

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
