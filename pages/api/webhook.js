export default async function handler(req, res) {
  const {method, body} = req

  if (method === "POST") {
    if (body.status === "COMPLETED") {
      // Video processing is completed. The video URL is available in body.output.file_url
      // Do something with the video URL here, for example, save it to the database or send it to the client via socket.io
      console.log("Video URL:", body.output.file_url)

      res.status(200).json({message: "Webhook received"})
    } else {
      // Unexpected status
      res.status(400).json({message: "Invalid status"})
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
