import {useState} from "react"
import {createContext, useContext} from "react"

export const appContext = createContext(null)

export default function Context({children}) {
  const [selectedImage, setSelectedImage] = useState("")

  return (
    <appContext.Provider value={{selectedImage, setSelectedImage}}>
      {children}
    </appContext.Provider>
  )
}

export function useAppContext() {
  return useContext(appContext)
}
