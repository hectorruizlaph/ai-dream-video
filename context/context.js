import {useState} from "react"
import {createContext, useContext} from "react"

export const appContext = createContext(null)

export default function Context({children}) {
  const [selectedImages, setSelectedImages] = useState({
    image1: "",
    image2: "",
  })

  return (
    <appContext.Provider value={{selectedImages, setSelectedImages}}>
      {children}
    </appContext.Provider>
  )
}

export function useAppContext() {
  return useContext(appContext)
}
