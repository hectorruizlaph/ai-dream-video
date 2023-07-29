import React, {useState, useEffect, useRef} from 'react'
import {Box, Text, Center} from '@mantine/core'
import {useAppContext} from '../../context/context'
import Image from 'next/image'
import axios from 'axios'

export default function VideoOutput() {
  const {videoStatus, videoURL} = useAppContext()
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoStatus === 'ready') {
      let video = videoRef.current
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
    }
  }, [videoStatus, videoURL])

  return (
    <Box mx='auto'>
      {videoStatus === 'loading' ? (
        <>
          <Text size='sm' weight={500} mt='md'>
            Our AI it&apos;s creating your video...
          </Text>
          <Center mx='auto'>
            <Image
              className='rounded-full'
              alt='ai-loading'
              src='/ai-loading.gif'
              width={512}
              height={512}
            />
          </Center>
        </>
      ) : (
        <Center mx='auto'>
          <video width='512' height='512' controls ref={videoRef}>
            <source src={videoURL} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </Center>
      )}
    </Box>
  )
}
