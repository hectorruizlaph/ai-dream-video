import prisma from "../../utils/prisma"
import AWS from "aws-sdk"

export default async function handler(req, res) {
  try {
    const videos = await prisma.video.findMany()

    // Create an instance of the AWS SDK
    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_ID,
      secretAccessKey: process.env.S3_ACCESS_SECRET,
      endpoint: process.env.S3_ENDPOINT_URL,
      region: process.env.S3_REGION,
    })

    // Fetch the video URLs from the S3 bucket
    const videoUrls = await Promise.all(
      videos.map(async (video) => {
        const key = `bucket-testt/${video.videoId}.mp4`

        // Generate a signed URL to access the video file
        const signedUrl = await s3.getSignedUrlPromise("getObject", {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
        })

        return signedUrl
      })
    )

    res.status(200).json({videoUrls})
  } catch (error) {
    console.error("Failed to fetch videos:", error)
    res.status(500).json({error: "Error fetching videos."})
  }
}
