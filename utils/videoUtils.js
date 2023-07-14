const ffmpegPath = require('ffmpeg-static').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

export const extractLastFrame = (videoPath, outputPath) => {
  console.log('||||| entered extractLastFrame ||||')
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .screenshots({
        timestamps: ['99%'],
        filename: 'thumbnail.png',
        folder: outputPath,
        size: '512x512',
      })
  })
}
