import {NextApiRequest, NextApiResponse} from 'next'
import {getErrorMessage} from '../../utils/getErrorMessage'
import S3 from 'aws-sdk/clients/s3'
import {randomUUID} from 'crypto'

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  region: process.env.S3_UPLOAD_REGION,
  signatureVersion: 'v4',
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {query} = req
  const {filename, contentType} = query

  // console.log("postPhoto - filename:", filename) // newFile.png
  // console.log("postPhoto - contentType:", contentType) // image/png

  try {
    // const client = new S3Client({region: process.env.S3_UPLOAD_REGION})

    const ex = (contentType as string).split('/')[1]
    const Key = `images/${randomUUID()}.${ex}`

    const s3Params = {
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key,
      Expires: 60,
      ContentType: `image/${ex}`,
    }

    const uploadUrl = await s3.getSignedUrl('putObject', s3Params)
    // console.log("uploadUrl", uploadUrl)
    const cleanUrl = (uploadUrl as string).split('?')[0]

    // console.log("cleanUrl: ", cleanUrl)
    // const {url, fields} = await createPresignedPost(client, {
    //   Bucket: process.env.S3_UPLOAD_BUCKET!,
    //   Key: fileKey,
    //   Conditions: [["starts-with", "$Content-Type", contentType?.toString()!]],
    //   Fields: {
    //     acl: "public-read",
    //     "Content-Type": contentType?.toString()!,
    //   },
    //   Expires: 600,
    // })

    // const imageUrl = `https://${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com/${Key}`

    // console.log("cleanUrl: ", cleanUrl)

    return res.json({cleanUrl})
  } catch (error) {
    console.log('Error:', error)
    return res.json({error: getErrorMessage(error)})
  }
}

export default handler
