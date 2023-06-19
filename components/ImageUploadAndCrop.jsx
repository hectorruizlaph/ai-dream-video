import React, {useState, useCallback} from "react"
import Cropper from "react-easy-crop"
import getCroppedImg from "../utils/cropImage"
import {useAppContext} from "../context/context"
import Image from "next/image"

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

    // Use filename and content type of your cropped image
    const filename = croppedImage.name // should be 'newFile.png'
    const contentType = croppedImage.type // should be 'image/png'

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
      {
        <>
          <div className="flex flex-col justify-center align-middle p-4 bg-slate-200 rounded-md border-2 border-slate-400 border-dashed hover:cursor-pointer hover:bg-slate-300">
            <label htmlFor="upload-input" className="cursor-pointer mx-auto">
              <Image
                src="/images/upload-image.png"
                draggable={"false"}
                alt="placeholder"
                width={100}
                height={100}
                className="mx-auto"
                onClick={() => setSelectedImage(null)}
              />
              <p className="text-slate-700">Click to upload image</p>
            </label>
            <input
              className="hidden"
              id="upload-input"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />
          </div>
          {/* <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="mt-4"
          /> */}
          {imageSrc && !selectedImage && (
            <div className="flex flex-col space-y-2 justify-center align-middle">
              <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
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
          )}
        </>
      }
      {selectedImage && <img src={selectedImage} alt="Selected" />}
    </div>
  )
}

export default ImageUploadAndCrop
