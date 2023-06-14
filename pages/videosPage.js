import {useEffect, useState} from "react"

export default function VideosPage() {
  const [videoUrls, setVideoUrls] = useState([])

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos")
        const data = await response.json()
        setVideoUrls(data.videoUrls)
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      }
    }

    fetchVideos()
  }, [])

  return (
    <div>
      <h1>Videos</h1>
      {videoUrls.map((url, index) => (
        <div key={index}>
          <video controls>
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  )
}
