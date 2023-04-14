import {useAppContext} from "../context/context"

import React from "react"

const SelectImage = () => {
  const {selectedImage, setSelectedImage} = useAppContext()

  return <div>imageSelected</div>
}

export default SelectImage
