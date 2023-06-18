import AWS from "aws-sdk"
import multer from "multer"
import sharp from "sharp"
import {v4 as uuidv4} from "uuid"

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  region: process.env.S3_UPLOAD_REGION,
})

const storage = multer.memoryStorage() // Use memory storage

const upload = multer({storage: storage})

const resizeAndUpload = upload.single("image")

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    resizeAndUpload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({error: err.message})
      }

      try {
        const buffer = await sharp(req.file.buffer).resize(512, 512).toBuffer() // Resize image

        const params = {
          Bucket: process.env.S3_UPLOAD_BUCKET,
          Key: `images/${uuidv4()}.jpg`,
          Body: buffer,
          ContentType: req.file.mimetype,
          ACL: "public-read",
        }

        // Upload resized image to S3
        s3.upload(params, (error, data) => {
          if (error) {
            res.status(500).json({error: error})
          } else {
            const image = {
              url: data.Location,
              mimetype: req.file.mimetype,
            }
            res.status(200).json(image)
          }
        })
      } catch (error) {
        res.status(500).json({error: "Error resizing image"})
      }
    })
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
