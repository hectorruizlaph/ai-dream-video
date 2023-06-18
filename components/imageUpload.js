import {useState} from "react"
import Image from "next/image"
import {useAppContext} from "../context/context"
import axios from "axios"

export function ImageUpload({onUpload}) {
  const [image, setImage] = useState("")
  const [isUploaded, setIsUploaded] = useState(false)
  const {selectedImage, setSelectedImage} = useAppContext()

  async function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      let formData = new FormData()
      formData.append("image", file)

      try {
        const res = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        const imageUrl = res.data.url
        setImage(imageUrl)
        setIsUploaded(true)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleImageSelect = (imageUrl) => {
    console.log("selected image:", imageUrl)
    setSelectedImage(imageUrl)
  }

  return (
    <div>
      <div className="flex justify-center align-middle">
        {!isUploaded ? (
          <div className="flex flex-col justify-center align-middle p-4 bg-slate-200 rounded-md border-2 border-slate-400 border-dashed hover:cursor-pointer hover:bg-slate-300">
            <label htmlFor="upload-input" className="cursor-pointer mx-auto">
              <Image
                src="/images/upload-image.png"
                draggable={"false"}
                alt="placeholder"
                width={100}
                height={100}
                className="mx-auto"
              />
              <p className="text-slate-700">Click to upload image</p>
            </label>
            <input
              className="hidden"
              id="upload-input"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
            />
          </div>
        ) : (
          <div className="flex">
            <Image
              className="z-50 absolute cursor-pointer hover:border-2 mx-auto rounded-lg bg-amber-400 ml-[235px] -mt-[15px]"
              src="/images/close.png"
              alt="CloseIcon"
              onClick={() => {
                setIsUploaded(false)
                setImage("")
              }}
              width={30}
              height={30}
            />
            <Image
              id="uploaded-image"
              src={image}
              draggable={false}
              alt="uploaded-img"
              width={512}
              height={512}
              className="cursor-pointer rounded-sm hover:ring-4 hover:ring-teal-500"
            />
          </div>
        )}
      </div>
    </div>
  )
}
