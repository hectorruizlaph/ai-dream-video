import React, {useState, useEffect} from "react"
import {Box} from "@mantine/core"
import {useAppContext} from "../../context/context"
import Image from "next/image"

export default function VideoOutput() {
  const {videoStatus, videoURL} = useAppContext()
  console.log("(out of effect) videoStatus: ", videoStatus)
  console.log("(out of effect) videoURL: ", videoURL)

  useEffect(() => {
    console.log("(out of effect) videoStatus: ", videoStatus)
    console.log("(out of effect) videoURL: ", videoURL)
  }, [videoStatus, videoURL])
  return (
    <Box maw={500} mx="auto">
      {videoStatus === "loading" ? (
        <Image
          alt="ai-loading"
          src="/loading-ai.gif"
          width={800}
          height={600}
        />
      ) : (
        <video width="512" height="512" controls>
          <source src={videoURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </Box>
  )
}
