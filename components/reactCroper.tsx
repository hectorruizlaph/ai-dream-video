import React, {useState, createRef, useEffect} from "react"
import Cropper, {ReactCropperElement} from "react-cropper"
import "cropperjs/dist/cropper.css"

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg"

export const ReactCroper: React.FC = () => {
  const [image, setImage] = useState(defaultSrc)
  const [cropData, setCropData] = useState("#")
  const cropperRef = createRef<ReactCropperElement>()
  const onChange = (e: any) => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as any)
    }
    reader.readAsDataURL(files[0])
  }

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL())
    }
  }

  useEffect(() => {
    if (cropperRef.current) {
      const cropperInstance = cropperRef.current.cropper
      cropperInstance.setCropBoxData({width: 512, height: 512})
    }
  }, [image])

  return (
    <div>
      <div className="w-full">
        <input type="file" onChange={onChange} />
        <button>Use default img</button>
        <br />
        <br />
        <Cropper
          ref={cropperRef}
          style={{height: 512, width: 512}}
          zoomTo={0.5}
          initialAspectRatio={1}
          preview=".img-preview"
          src={image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          guides={true}
        />
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <h1>Preview</h1>
          <div className="img-preview w-full h-128 overflow-hidden" />
        </div>
        <div className="w-1/2 h-128">
          <h1>
            <span>Crop</span>
            <button className="float-right" onClick={getCropData}>
              Crop Image
            </button>
          </h1>
          <img className="w-full" src={cropData} alt="cropped" />
        </div>
      </div>
    </div>
  )
}

export default ReactCroper
