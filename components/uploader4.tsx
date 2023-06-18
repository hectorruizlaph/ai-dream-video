import React, {useState} from "react"
import {useAppContext} from "../context/context"
import Cropper, {Area} from "react-easy-crop"
import getCroppedImg from "../utils/cropImage"
import "react-easy-crop/react-easy-crop.css"

export default function Uploader4() {
  const [file, setFile] = React.useState<File | null>(null)
  const [uploading, setUploading] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>("")
  const [show, setShow] = React.useState<string>("hidden")
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [showCrop, setShowCrop] = useState<boolean | null>(null)

  const {selectedImage, setSelectedImage} = useAppContext()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedImage || !croppedAreaPixels) {
      setMessage("Please select and crop an image to upload.")
      return
    }

    setUploading(true)

    // create a new canvas and context
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // create a new image
    const img = new Image()
    img.src = selectedImage

    // once the image loads, draw the desired cropped area onto the canvas
    img.onload = async () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height
      ctx?.drawImage(
        img,
        croppedAreaPixels.x * aspectRatio,
        croppedAreaPixels.y * aspectRatio,
        croppedAreaPixels.width * aspectRatio,
        croppedAreaPixels.height * aspectRatio,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      // convert the canvas to a Blob (essentially a type of file)
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setMessage("Failed to create file from cropped image.")
          return
        }

        // create a new File from the Blob
        const newFile = new File([blob], file.name, {type: file.type})

        // get the pre-signed URL from the server
        const response = await fetch(
          `/api/postPhoto?filename=${newFile.name}&contentType=${newFile.type}`
        )

        if (response.ok) {
          const {url, fields, imageUrl} = await response.json()
          console.log("Response:", {url, fields, imageUrl})

          const formData = new FormData()
          Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value as string)
          })
          formData.append("file", newFile)

          const uploadResponse = await fetch(url, {
            method: "POST",
            body: formData,
          })

          if (uploadResponse.ok) {
            setMessage("Upload successful!")
            setImageUrl(imageUrl)
            setSelectedImage(imageUrl)
          } else {
            console.error("S3 Upload Error:", uploadResponse)
            setMessage("Upload failed.")
          }
        } else {
          setMessage("Failed to get pre-signed URL.")
        }

        setUploading(false)
      }, file.type)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      console.log("handleFileChange - files[0]: ", files[0])
      setFile(files[0])
      console.log(
        "handleFileChange - URL.createObjectURL(files[0]): ",
        URL.createObjectURL(files[0])
      )
      setSelectedImage(URL.createObjectURL(files[0]))
      setShowCrop(true) // Show the cropping UI
    }
  }

  React.useEffect((): void => {
    if (message.length > 0) {
      setShow("block")
    }
  }, [show, message])

  const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log("croppedAreaPixels: ", croppedAreaPixels)
    console.log("croppedArea: ", croppedArea) // Add this log to verify the cropped area values
    try {
      const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels)
      setSelectedImage(croppedImage)
      setShowCrop(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <div className="bg-white h-screen sm:h-full sm:py-24">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Upload a File to S3
            </h2>
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-md gap-x-4"
            >
              <input
                id="file"
                type="file"
                className="cursor-pointer min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
              />
              <button
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                type="submit"
                disabled={uploading}
              >
                Upload
              </button>
            </form>
            <div className={`pt-2 relative ${show}`}>
              <div className="absolute left-[40%] mx-auto rounded-md bg-white/5 px-3.5 py-4 text-white">
                {message}
              </div>
              {imageUrl && <img src={imageUrl} alt="Uploaded" />}
              {showCrop && selectedImage && (
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 sm:h-[64rem] w-[64rem] -translate-x-1/2"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient
                  id="759c1415-0410-454c-8f7c-9a820de03641"
                  cx={0}
                  cy={0}
                  r={1}
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(512 512) rotate(90) scale(512)"
                >
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" stopOpacity={0} />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </main>
  )
}
