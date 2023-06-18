export default function Home() {
  const [file, setFile] = useState(null)
  const [upload, setUpload] = useState(null)
  const progress = useMotionValue(0)

  function ProgressBar({value}) {
    const width = useSpring(value, {damping: 20})
    return (
      <div className="flex h-6 w-full flex-row items-start justify-start">
        <div
          className="h-full w-full bg-green-500"
          style={{scaleX: width, originX: 0}}
          transition={{ease: "easeIn"}}
        />
      </div>
    )
  }

  useEffect(() => {
    return upload?.abort()
  }, [])

  useEffect(() => {
    progress.set(0)
    setUpload(null)
  }, [file])

  const handleFileChange = (e) => {
    e.preventDefault()
    setFile(e.target.files[0])
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    const params = {
      Bucket: "upmostly-nextjs-s3-file-upload",
      Key: file.name,
      Body: file,
    }
    console.log(params)

    try {
      const upload = s3.upload(params)
      setUpload(upload)
      upload.on("httpUploadProgress", (p) => {
        console.log(p.loaded / p.total)
        progress.set(p.loaded / p.total)
      })
      await upload.promise()
      console.log(`File uploaded successfully: ${file.name}`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancel = (e) => {
    e.preventDefault()
    if (!upload) return
    upload.abort()
    progress.set(0)
    setUpload(null)
  }
  return (
    <div className="dark flex min-h-screen w-full items-center justify-center">
      <main>
        <form className="flex flex-col gap-4 rounded bg-stone-800 p-10 text-white shadow">
          <input type="file" onChange={handleFileChange} />
          <button
            className="rounded bg-green-500 p-2 shadow"
            onClick={handleUpload}
          >
            Upload
          </button>
          {upload && (
            <>
              <button
                className="rounded bg-red-500 p-2 shadow"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <ProgressBar value={progress} />
            </>
          )}
        </form>
      </main>
    </div>
  )
}
