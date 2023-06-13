export default async function handler(req, res) {
  if (req.method === "POST") {
    // Do something with the incoming data, for example save it to a file
    const mp4Buffer = req.body
    const fs = require("fs")
    fs.writeFile("video.mp4", mp4Buffer, "binary", (err) => {
      if (err) throw err
      console.log("Video saved!")
    })

    res.status(200).json({status: "Received"})
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"])
    res.status(405).json({message: `Method ${req.method} is not allowed`})
  }
}
