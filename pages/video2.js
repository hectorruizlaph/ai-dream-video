import {useState} from "react"
import useSWR from "swr"
import axios from "axios"

async function fetcher(url) {
  const res = await axios.get(url)
  if (res.status !== 200) {
    throw new Error("Failed to fetch")
  }
  return res.data
}

export default function VideoPage() {
  const [animationPrompts, setAnimationPrompts] = useState("")
  const [initImage, setInitImage] = useState("")
  const [runpodId, setRunpodId] = useState(null)
  const [error, setError] = useState(null)

  const {data, error: statusError} = useSWR(
    runpodId ? `/api/status/${runpodId}` : null,
    fetcher,
    {
      refreshInterval: 5000, // Fetch status every 5 seconds
    }
  )

  const createVideo = async () => {
    try {
      const res = await axios.post("/api/video2", {animationPrompts, initImage})
      setRunpodId(res.data.runpodId)
    } catch (error) {
      setError(error.message)
    }
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (statusError) {
    return <p>Error: {statusError.message}</p>
  }

  return (
    <div>
      <h1>Create Video</h1>
      <input
        type="text"
        placeholder="Enter animation prompts"
        value={animationPrompts}
        onChange={(e) => setAnimationPrompts(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter init image URL"
        value={initImage}
        onChange={(e) => setInitImage(e.target.value)}
      />
      <button onClick={createVideo}>Create Video</button>

      {runpodId && <p>Runpod ID: {runpodId}</p>}

      {data?.status === "COMPLETED" && (
        <div>
          <p>Video created!</p>
          <video src={data.output.file_url} controls />
        </div>
      )}

      {data?.status === "FAILED" && <p>Video creation failed!</p>}

      {data?.status === "IN_PROGRESS" && (
        <p>Video is being created, please wait...</p>
      )}
    </div>
  )
}
