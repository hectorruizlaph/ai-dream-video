import React, {useState, useCallback} from "react"
import Cropper from "react-easy-crop"
import getCroppedImg from "../utils/cropImage"

const ImageUploadAndCrop = () => {
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImageSrc, setCroppedImageSrc] = useState(null)
  const [displayCrop, setDisplayCrop] = useState(true)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageDataUrl = await readFile(file)
      setImageSrc(imageDataUrl)
    }
  }

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const generateCroppedImage = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
    setCroppedImageSrc(croppedImage)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="mt-4"
      />
      {imageSrc && displayCrop ? (
        <div className="flex flex-col space-y-2 justify-center align-middle">
          <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <button
            onClick={generateCroppedImage}
            disabled={!imageSrc}
            className="p-4 bg-black text-white font-semibold rounded-md"
          >
            Crop & Use
          </button>
        </div>
      ) : null}
      {croppedImageSrc && <img src={croppedImageSrc} alt="Cropped" />}
    </div>
  )
}

export default ImageUploadAndCrop
