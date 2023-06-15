import {useState, useContext} from "react"
import {appContext} from "../context/context.js"

export default function CreateVideoForm() {
  const [animationPrompts, setAnimationPrompts] = useState("")
  const [videoStatus, setVideoStatus] = useState("idle") // 'idle' | 'loading' | 'ready'
  const [videoURL, setVideoURL] = useState("")

  const {selectedImage} = useContext(appContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setVideoStatus("loading")

    const res = await fetch("/api/video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        animationPrompts,
        initImage: selectedImage,
      }),
    })

    const data = await res.json()

    // console.log(data) // Log the response data

    if (data.message === "Video creation process completed") {
      setVideoStatus("ready")
      // console.log("data.videoURL:", `${data.data.videoURL}`)
      setVideoURL(`${data.data.videoURL}`)
      // console.log("videoURL_client:", videoURL)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:py-12">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-xl w-80"
      >
        <div className="mb-4">
          <label className="block text-gray-700">
            Animation Prompts:
            <input
              type="text"
              value={animationPrompts}
              onChange={(e) => setAnimationPrompts(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>

      {videoStatus === "loading" && (
        <p className="mt-6 text-center text-gray-500">
          Loading... this will take some minutes (4-5)
        </p>
      )}
      {videoStatus === "ready" && (
        <div className="mt-6">
          <video
            className="rounded shadow-lg"
            width="512"
            height="512"
            controls
          >
            <source src={videoURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  )
}
