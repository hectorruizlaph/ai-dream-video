// components/video.js
import {useState, useEffect} from "react"
import axios from "axios"

const Video = () => {
  const [videoURL, setVideoURL] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRun = async (event) => {
    event.preventDefault()

    setLoading(true)

    try {
      const response = await axios.post("/api/video", {
        model_checkpoint: "revAnimated_v122.ckpt",
        animation_prompts: event.target.animation_prompts.value,
        max_frames: 100,
        num_inference_steps: 50,
        fps: 15,
        use_init: true,
        init_image:
          "https://avatar20.s3.amazonaws.com/next-s3-uploads/000f8bd1-1038-4ca3-bddb-5901540a606a/ligr7029.jpeg",
        animation_mode: "3D",
        zoom: "0:(1)",
        translation_x: "0:(0)",
        strength_schedule: "0: (0.9)",
      })
      const {data} = res
      // Assuming the data returned includes a video url in the format: { videoUrl: 'https://...' }
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
