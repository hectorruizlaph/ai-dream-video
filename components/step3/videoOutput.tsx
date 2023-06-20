import React, {useState, useEffect} from "react"
import {Box, Text, Center} from "@mantine/core"
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
    <Box mx="auto">
      {videoStatus === "loading" ? (
        <>
          <Text size="sm" weight={500} mt="md">
            Our AI it&apos;s creating your video...
          </Text>
          <Center mx="auto">
            <Image
              className="rounded-full"
              alt="ai-loading"
              src="/ai-loading.gif"
              width={512}
              height={512}
            />
          </Center>
        </>
      ) : (
        <Center mx="auto">
          <video width="512" height="512" controls>
            <source src={videoURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Center>
      )}
    </Box>
  )
}
