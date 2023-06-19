import {createPresignedPost} from "@aws-sdk/s3-presigned-post"
import {S3Client} from "@aws-sdk/client-s3"
import {NextApiRequest, NextApiResponse} from "next"
import {getErrorMessage} from "../../utils/getErrorMessage"
import {v4 as uuidv4} from "uuid"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {query} = req
  const {filename, contentType} = query

  console.log("filename:", filename)
  console.log("contentType:", contentType)

  try {
    const client = new S3Client({region: process.env.S3_UPLOAD_REGION})

    console.log("S3 region:", process.env.S3_UPLOAD_REGION)

    const fileKey = `images/${uuidv4()}`

    const {url, fields} = await createPresignedPost(client, {
      Bucket: process.env.S3_UPLOAD_BUCKET!,
      Key: fileKey,
      Conditions: [["starts-with", "$Content-Type", contentType?.toString()!]],
      Fields: {
        acl: "public-read",
        "Content-Type": contentType?.toString()!,
      },
      Expires: 600,
    })

    console.log("url:", url)
    console.log("fields:", fields)

    const imageUrl = `https://s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com/${process.env.S3_UPLOAD_BUCKET}/${fileKey}`

    console.log("imageUrl:", imageUrl)

    return res.json({url, fields, imageUrl})
  } catch (error) {
    console.log("Error:", error)
    return res.json({error: getErrorMessage(error)})
  }
}

export default handler
