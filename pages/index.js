import {useState} from "react"
import Head from "next/head"
import Image from "next/image"
import {useAppContext} from "../context/context"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Home() {
  const [errorImage, setErrorImage] = useState("")
  const [isUploaded, setIsUploaded] = useState(false)
  const [typeFile, setTypeFile] = useState("")

  const {selectedImages, setSelectedImages} = useAppContext()

  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)
  const [replicateKey, setReplicateKey] = useState("")

  function handleImageChange(e, targetImage) {
    if (e.target.files && e.target.files[0]) {
      setErrorImage("")
      let reader = new FileReader()

      reader.onload = function (e) {
        setSelectedImages((prevImages) => {
          return {
            ...prevImages,
            [targetImage]: e.target.result,
          }
        })
        console.log(selectedImages)
        setIsUploaded(true)
      }

      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
        replicateKey: replicateKey,
      }),
    })
    let prediction = await response.json()
    if (response.status !== 201) {
      setError(prediction.detail)
      return
    }
    setPrediction(prediction)

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000)
      const response = await fetch("/api/predictions/" + prediction.id)
      prediction = await response.json()
      if (response.status !== 200) {
        setError(prediction.detail)
        return
      }
      console.log(JSON.stringify(prediction, null, 2))
      setPrediction(prediction)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>Video AI</title>
      </Head>
      <div className="flex justify-center items-center gap-2">
        <p className="font-medium">Replicate Token:</p>
        <input
          type="text"
          className="flex-grow min-w-[80%] mx-auto"
          name="prompt"
          placeholder="Your replicate token"
          value={replicateKey}
          onChange={(e) => setReplicateKey(e.target.value)}
        />
      </div>
      <p>
        If you don&apos;t have one: go to{" "}
        <a
          href="https://replicate.com"
          target="__blank"
          className="text-cyan-600"
        >
          https://replicate.com
        </a>
        , create an account, then go to &quot;Account&quot; and copy your API
        token
      </p>

      <h1 className="py-6 text-center font-bold text-2xl">
        Upload an image or Dream one
      </h1>
      {error && <div>{error}</div>}
      <div className="max-w-2xl pt-2">
        {prediction ? (
          <>
            {prediction.output && (
              <div className="grid grid-cols-4 gap-4 mx-auto">
                <div className="mx-auto">
                  <Image
                    // src={prediction.output[prediction.output.length - 1]}
                    src="/images/out-0.png"
                    alt="output"
                    width={250}
                    height={250}
                    className="cursor-pointer hover:ring-4 hover:ring-green-500"
                  />
                </div>
                <div className="mx-auto">
                  <Image
                    src="/images/out-1.png"
                    // src={prediction.output[prediction.output.length - 2]}
                    alt="output"
                    width={250}
                    height={250}
                    className="cursor-pointer hover:ring-4 hover:ring-green-500"
                  />
                </div>
                <div className="mx-auto">
                  <Image
                    // src={prediction.output[prediction.output.length - 3]}
                    src="/images/out-2.png"
                    alt="output"
                    width={250}
                    height={250}
                    className="cursor-pointer hover:ring-4 hover:ring-green-500"
                  />
                </div>
                <div className="mx-auto">
                  <Image
                    // src={prediction.output[prediction.output.length - 4]}
                    src="/images/out-3.png"
                    alt="output"
                    width={250}
                    height={250}
                    className="cursor-pointer hover:ring-4 hover:ring-green-500"
                  />
                </div>
              </div>
            )}
            <p className="py-3 text-sm opacity-50">
              status: {prediction.status}
            </p>
          </>
        ) : (
          <div>
            {/* <DragDropFiles /> */}
            <div className="flex justify-center align-middle">
              {errorImage ? <p>{errorImage}</p> : null}
              {!isUploaded ? (
                <div className="flex flex-col justify-center align-middle p-4 bg-slate-200 rounded-md border-2 border-slate-400 border-dashed hover:cursor-pointer hover:bg-slate-300">
                  <label
                    htmlFor="upload-input"
                    className="cursor-pointer mx-auto"
                  >
                    <Image
                      src="/images/upload-image.png"
                      draggable={"false"}
                      alt="placeholder"
                      width={100}
                      height={100}
                      className="mx-auto"
                    />
                    <p className="text-slate-700">Click to upload image</p>
                  </label>

                  <input
                    className="hidden"
                    id="upload-input"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleImageChange(e, "image1")}
                  />
                </div>
              ) : (
                <div className="flex">
                  <Image
                    className="z-50 absolute cursor-pointer hover:bg-amber-500 mx-auto rounded-full bg-amber-400 ml-[235px] -mt-[15px]"
                    src="/images/close.png"
                    alt="CloseIcon"
                    onClick={() => {
                      setIsUploaded(false)
                      setSelectedImages(null)
                    }}
                    width={30}
                    height={30}
                  />
                  <Image
                    id="uploaded-image"
                    src={selectedImages}
                    draggable={false}
                    alt="uploaded-img"
                    width={250}
                    height={250}
                    className="cursor-pointer rounded-sm hover:ring-4 hover:ring-teal-500"
                  />
                </div>
              )}
            </div>

            {isUploaded ? <h2>Type is {typeFile}</h2> : null}
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-center py-2">Or</p>
      </div>
      <div className="max-w-[512px] pt-2 mx-auto">
        <div className="grid grid-cols-2 gap-2">
          <div className="mx-auto">
            <Image
              // src={prediction.output[prediction.output.length - 1]}
              src="/images/out-0.png"
              alt="output"
              width={250}
              height={250}
              className="cursor-pointer rounded-sm hover:ring-4 hover:ring-teal-500"
            />
          </div>
          <div className="mx-auto">
            <Image
              src="/images/out-1.png"
              // src={prediction.output[prediction.output.length - 2]}
              alt="output"
              width={250}
              height={250}
              className="cursor-pointer rounded-sm hover:ring-4 hover:ring-teal-500"
            />
          </div>
          <div className="mx-auto">
            <Image
              // src={prediction.output[prediction.output.length - 3]}
              src="/images/out-2.png"
              alt="output"
              width={250}
              height={250}
              className="cursor-pointer rounded-sm hover:ring-4 hover:ring-teal-500"
            />
          </div>
          <div className="mx-auto">
            <Image
              // src={prediction.output[prediction.output.length - 4]}
              src="/images/out-3.png"
              alt="output"
              width={250}
              height={250}
              className="cursor-pointer rounded-sm hover:ring-4 hover:ring-teal-500"
            />
          </div>
        </div>
      </div>
      <form className="w-full flex mt-2" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow"
          name="prompt"
          placeholder="Enter a prompt to display an image"
        />
        <button className="button" type="submit">
          Go!
        </button>
      </form>
    </div>
  )
}
