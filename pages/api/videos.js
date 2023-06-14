import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: "us-west-1", // Replace with your desired region
  credentials: {
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey: process.env.S3_ACCESS_SECRET,
  },
})

export default async function handler(req, res) {
  try {
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: "bucket-testt/", // Replace with the path to your videos
    })

    const response = await s3Client.send(listObjectsCommand)

    const videoUrls = []
    for (const object of response.Contents) {
      const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: object.Key,
      })
      const signedUrl = await s3Client.getSignedUrlPromise(getObjectCommand)
      videoUrls.push(signedUrl)
    }

    res.status(200).json({videoUrls})
  } catch (error) {
    console.error("Failed to fetch videos:", error)
    res.status(500).json({error: "Failed to fetch videos"})
  }
}
