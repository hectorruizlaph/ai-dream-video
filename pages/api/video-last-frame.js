// File: /pages/api/video-last-frame.js
import axios from 'axios'
import AWS from 'aws-sdk'
import ffmpeg from 'fluent-ffmpeg'
import randomUUID from 'crypto'
import fs from 'fs'

export default async function handler(req, res) {
  const origin = req.headers.get('origin')

  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method not allowed'})
  }

  const {videoUrl} = req.body

  try {
    const response = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream',
    })

    const outputPath = `/tmp/last_frame_${randomUUID()}.png`

    ffmpeg(response.data)
      .on('end', async () => {
        // Frame extracted, now upload to S3
        const fileStream = fs.createReadStream(outputPath)

        const s3 = new AWS.S3({
          accessKeyId: process.env.S3_UPLOAD_KEY,
          secretAccessKey: process.env.S3_UPLOAD_SECRET,
          region: process.env.S3_UPLOAD_REGION,
        })

        const params = {
          Bucket: process.env.S3_UPLOAD_BUCKET,
          Key: `frames/${uuidv4()}.png`,
          Body: fileStream,
        }

        const uploadResult = await s3.upload(params).promise()

        // Delete temp file
        fs.unlinkSync(outputPath)
        res.setHeader('Access-Control-Allow-Origin', '*')

        res.status(200).json({
          message: 'Frame extraction and upload successful',
          imageUrl: uploadResult.Location,
        })
      })
      .on('error', (error) => {
        console.error('Error in ffmpeg processing:', error)
        res.status(500).json({message: 'Error in ffmpeg processing'})
      })
      .screenshots({
        timestamps: ['100%'],
        filename: outputPath,
        folder: '/tmp',
      })
  } catch (error) {
    console.error(error)
    res.setHeader('Access-Control-Allow-Origin', '*')

    res.status(500).json({message: 'Something went wrong'})
  }
}
