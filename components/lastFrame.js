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
        axios
          .post('/api/postPhoto', blob, {
            headers: {
              'Content-Type': 'image/png',
            },
          })
          .then((response) => {
            console.log(response)
            // Handle the response as needed...
          })
          .catch((error) => {
            console.error(error)
            // Handle the error as needed...
          })
      }, 'image/png')
    })
  }, [videoUrl])

  return null
}

export default LastFrame
