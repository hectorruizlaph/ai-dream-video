import {Area} from "react-easy-crop/types"

// Converts a Blob into a File
const blobToFile = (blob: Blob, name: string): File => {
  return new File([blob], name, {type: blob.type})
}

const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<File> => {
  const image = new Image()
  image.src = imageSrc

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  // Set the canvas dimensions to be 512x512px
  canvas.width = 512
  canvas.height = 512

  await new Promise((resolve) => {
    image.onload = resolve
  })

  // Draw the image on the canvas, taking the cropped area's position and size into account
  // The image will be scaled to fit the 512x512px canvas
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blobToFile(blob, "newFile.png"))
      } else {
        reject("Cropping failed: Canvas is empty or could not be encoded.")
      }
    }, "image/png")
  })
}

export default getCroppedImg
