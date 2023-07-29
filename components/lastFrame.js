import {useEffect} from 'react'
import axios from 'axios'

const LastFrame = ({videoUrl}) => {
  useEffect(() => {
    let video = document.createElement('video')
    video.src = videoUrl
    video.addEventListener('loadedmetadata', function () {
      this.currentTime = this.duration
    })
    video.addEventListener('seeked', function () {
      let canvas = document.createElement('canvas')
      canvas.width = this.videoWidth
      canvas.height = this.videoHeight
      let ctx = canvas.getContext('2d')
      ctx.drawImage(this, 0, 0)
      canvas.toBlob(function (blob) {
        // First, get the signed URL from your endpoint
        let filename = 'last_frame.png' // Provide an appropriate filename
        let contentType = 'image/png'
        axios
          .get(`/api/postPhoto?filename=${filename}&contentType=${contentType}`)
          .then((response) => {
            // Then, use the signed URL to upload the image data to S3
            axios
              .put(response.data.cleanUrl, blob, {
                headers: {
                  'Content-Type': contentType,
                },
              })
              .then(() => {
                console.log('Image uploaded successfully')
              })
              .catch((error) => {
                console.error('Error uploading the image:', error)
              })
          })
          .catch((error) => {
            console.error('Error getting the signed URL:', error)
          })
      }, 'image/png')
    })
  }, [videoUrl])

  return null
}

export default LastFrame
