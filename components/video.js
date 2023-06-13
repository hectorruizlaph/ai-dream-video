import {useState, useContext} from "react"
import axios from "axios"
import {useAppContext} from "../context/context"

export default function Video() {
  const [loading, setLoading] = useState(false)
  const [animationPrompts, setAnimationPrompts] = useState("")
  const [videoId, setVideoId] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)

  const {selectedImage, setSelectedImage} = useAppContext()

  const handleAnimation = async () => {
    setLoading(true)

    try {
      const response = await axios.post("/api/runVideo", {
        animationPrompts,
        initImage: selectedImage,
      })

      setVideoId(response.data.id)
      // After videoId is set, fetch the result video url
      await fetchResultVideo(response.data.id)
    } catch (error) {
      console.error("Failed to start animation:", error)
    }

    setLoading(false)
  }

  const fetchResultVideo = async (videoId) => {
    try {
      const response = await axios.get(`/api/video/${videoId}`)

      // assuming the response contains a direct url to the video
      setVideoUrl(response.data.videoUrl)
    } catch (error) {
      console.error("Failed to fetch result video:", error)
    }
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
