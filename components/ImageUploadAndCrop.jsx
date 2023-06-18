import React, {useState, useCallback} from "react"
import Cropper from "react-easy-crop"
import getCroppedImg from "../utils/cropImage"
import {useAppContext} from "../context/context"

const ImageUploadAndCrop = () => {
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({x: 0, y: 0})
  // const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImageSrc, setCroppedImageSrc] = useState(null)
  const [displayCrop, setDisplayCrop] = useState(true)

  const {selectedImage, setSelectedImage} = useAppContext()

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

    // Use filename and content type of your cropped image
    const filename = "croppedImage.jpg"
    const contentType = "image/jpeg"

    try {
      // Request a pre-signed URL from the postPhoto API
      const res = await fetch(
        `/api/postPhoto?filename=${filename}&contentType=${contentType}`
      )
      const {url, fields, imageUrl} = await res.json()

      // Create a form to POST the cropped image to the pre-signed URL
      const formData = new FormData()
      Object.entries({...fields, file: croppedImage}).forEach(
        ([key, value]) => {
          formData.append(key, value)
        }
      )

      // POST the cropped image to the pre-signed URL
      const imageRes = await fetch(url, {
        method: "POST",
        body: formData,
      })

      // If the request was successful, the image is now stored in your S3 bucket
      if (imageRes.ok) {
        console.log("Image uploaded successfully!", imageUrl)
        setSelectedImage(imageUrl)
      } else {
        console.error("Failed to upload image:", imageRes)
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
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
              // zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              // onZoomChange={setZoom}
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
