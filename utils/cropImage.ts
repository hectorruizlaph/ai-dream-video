// utils/cropImage.js

import {Area} from "react-easy-crop/types"

// Converts a Blob into a File
const blobToFile = (blob: Blob, name: string): File => {
  return new File([blob], name, {type: blob.type})
}

// const getCroppedImg = async (
//   imageSrc: string,
//   cropArea: Area
// ): Promise<string> => {
//   const image = new Image()
//   image.src = imageSrc

//   const canvas = document.createElement("canvas")
//   const ctx = canvas.getContext("2d")

//   // Set the canvas dimensions to 512x512px
//   canvas.width = 512
//   canvas.height = 512

//   await new Promise((resolve) => {
//     image.onload = resolve
//   })

//   // Update the drawing dimensions to fit the 512x512px canvas
//   ctx.drawImage(image, cropArea.x, cropArea.y, 512, 512, 0, 0, 512, 512)

//   return new Promise((resolve, reject) => {
//     canvas.toBlob((blob) => {
//       if (blob) {
//         resolve(URL.createObjectURL(blobToFile(blob, "newFile.png")))
//       } else {
//         reject("Cropping failed: Canvas is empty or could not be encoded.")
//       }
//     }, "image/png")
//   })
// }

const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<string> => {
  const image = new Image()
  image.src = imageSrc

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  // Use the dimensions of the cropped area in pixels for the canvas
  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height

  await new Promise((resolve) => {
    image.onload = resolve
  })

  // Draw the image on the canvas, taking the cropped area's position and size into account
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blobToFile(blob, "newFile.png")))
      } else {
        reject("Cropping failed: Canvas is empty or could not be encoded.")
      }
    }, "image/png")
  })
}

export default getCroppedImg
