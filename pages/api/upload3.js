import nextConnect from "next-connect"
import multer from "multer"
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"
import {createRequestPresigner} from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.S3_UPLOAD_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
  },
})

const upload = multer()

const handler = nextConnect()
  .use(upload.single("file"))
  .post(async (req, res) => {
    const file = req.file
    const key = Date.now().toString() + "-" + file.originalname

    const putParams = {
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    }

    try {
      await s3.send(new PutObjectCommand(putParams))

      const signedUrl = await createRequestPresigner(s3)
      const url = signedUrl(putParams, {expiresIn: 60 * 60 * 1000}) // 1 hour

      res.status(200).json({url})
    } catch (error) {
      console.error(error)
      res.status(500).json({error: "Error uploading file to S3"})
    }
  })

export default handler
