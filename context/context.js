import {useState} from "react"
import {createContext, useContext} from "react"

export const appContext = createContext(null)

export default function Context({children}) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [videoStatus, setVideoStatus] = useState("idle") // 'idle' | 'loading' | 'ready'
  const [videoURL, setVideoURL] = useState("")
  const [animationPrompts, setAnimationPrompts] = useState(null)

  const handleSubmitCreateVideo = async (e) => {
    // e.preventDefault()
    console.log("triggered handleSubmitCreateVideo")
    setVideoStatus("loading")

    console.log(selectedImage)

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
      console.log("selctedImage: ", selectedImage)
      // console.log("videoURL_client:", videoURL)
    }
  }

  return (
    <appContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        videoStatus,
        videoURL,
        handleSubmitCreateVideo,
        animationPrompts,
        setAnimationPrompts,
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export function useAppContext() {
  return useContext(appContext)
}
