import {useState, useEffect} from "react"
import axios from "axios"

const Video = () => {
  const [videoURL, setVideoURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [animationPrompts, setAnimationPrompts] = useState(
    "Initial animation prompt"
  )

  const handleRun = async (event) => {
    if (event) event.preventDefault()

    setLoading(true)

    try {
      const response = await axios.post("/api/video", {
        prompts: animationPrompts,
      })

      const {data} = response
      const cleanURL = data.videoURL.split("?")[0]
      setVideoURL(cleanURL)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    handleRun()
  }, [])

  return (
    <div>
      <input
        type="text"
        value={animationPrompts}
        onChange={(e) => setAnimationPrompts(e.target.value)}
        placeholder="Enter animation prompts"
      />
      <button onClick={handleRun} disabled={loading}>
        {loading ? "Loading..." : "Load Video"}
      </button>
      {videoURL && (
        <video width="320" height="240" controls>
          <source src={videoURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}

export default Video
