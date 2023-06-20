import {useState} from "react"
import {createContext, useContext} from "react"

export const appContext = createContext(null)

export default function Context({children}) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [videoJustCreated, setVideoJustCreated] = useState(null)
  const [animationPrompts, setAnimationPrompts] = useState(null)

  return (
    <appContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        videoJustCreated,
        setVideoJustCreated,
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
