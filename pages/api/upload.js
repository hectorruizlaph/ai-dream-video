import {randomUUID} from 'crypto'
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.S3_UPLOAD_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
  },
})

async function uploadImageToS3(file, fileName, mimeType) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}-${fileName}`,
    Body: file,
    ContentType: mimeType,
  }

  const command = new PutObjectCommand(params)
  await s3Client.send(command)

  return fileName
}
export default async function handler(request, response) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file) {
      return new Response(
        JSON.stringify({error: 'File blob is required.'}, {status: 400})
      )
    }

    const mimeType = file.type
    const fileExtension = mimeType.split('/')[1]

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = await uploadImageToS3(
      buffer,
      randomUUID() + '.' + fileExtension,
      mimeType
    )
    return new Response(JSON.stringify({success: true, fileName}))
  } catch (error) {
    console.error('Error uploading image:', error)
    return new Response(
      JSON.stringify({message: 'Error uploading image.'}, {status: 400})
    )
  }
}
