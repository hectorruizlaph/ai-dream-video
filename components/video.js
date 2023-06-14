// components/video.js

import {useState} from "react"
import axios from "axios"
import {useAppContext} from "../context/context"

export default function Video() {
  const [loading, setLoading] = useState(false)
  const [animationPrompts, setAnimationPrompts] = useState("")
  const [videoUrl, setVideoUrl] = useState(null)

  const {selectedImage} = useAppContext()

  const handleAnimation = async () => {
    setLoading(true)

    try {
      const response = await axios.post("/api/runVideo", {
        animationPrompts,
        initImage: selectedImage,
      })

      console.log("response.data.id:", response.data.videoId)
      const videoId = response.data.videoId
      // After videoId is set, fetch the result video url
      await fetchResultVideo(videoId)
    } catch (error) {
      console.error("Failed to start animation:", error)
    }

    setLoading(false)
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter animation prompts"
        value={animationPrompts}
        onChange={(e) => setAnimationPrompts(e.target.value)}
      />

      <button onClick={handleAnimation} disabled={loading}>
        {loading ? "Loading..." : "Start Animation"}
      </button>

      {videoUrl && (
        <video controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}
