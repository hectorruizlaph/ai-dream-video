import React, {useState, useCallback} from "react"
import Cropper from "react-easy-crop"
import ImgDialog from "./imgDialog"
import getCroppedImg from "../utils/cropImage"

const dogImg =
  "https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"

export const Demo = () => {
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        dogImg,
        croppedAreaPixels,
        rotation
      )
      console.log("donee", {croppedImage})
      setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  const onClose = useCallback(() => {
    setCroppedImage(null)
  }, [])

  return (
    <div className="container">
      <div className="crop-container">
        <Cropper
          image={dogImg}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="controls">
        <div className="slider-container">
          <p className="slider-label">Zoom</p>
          <input
            type="range"
            className="slider"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(e.target.value)}
          />
        </div>
        <div className="slider-container">
          <p className="slider-label">Rotation</p>
          <input
            type="range"
            className="slider"
            value={rotation}
            min={0}
            max={360}
            step={1}
            onChange={(e) => setRotation(e.target.value)}
          />
        </div>
        <button onClick={showCroppedImage} className="crop-button">
          Show Result
        </button>
      </div>
      <ImgDialog img={croppedImage} onClose={onClose} />
    </div>
  )
}
