import React, {useState, useEffect} from "react"

function VideoComponent() {
  const [video, setVideo] = useState(null)

  useEffect(() => {
    // Fetch video information from your API
    // This would be a call to your API endpoint that retrieves the video information based on some identifier (id or runpodId)

    fetch("/api/video/<id_or_runpodId>")
      .then((response) => response.json())
      .then((data) => setVideo(data))
  }, [])

  return (
    <div>
      {video?.videoURL ? (
        <video src={video.videoURL} controls autoplay />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default VideoComponent
