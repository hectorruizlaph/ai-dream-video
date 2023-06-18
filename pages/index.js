import {useState, useEffect} from "react"
import Head from "next/head"
import Image from "next/image"
import {useAppContext} from "../context/context"
import CreateVideoForm from "../components/createVideoForm"
import {ImageUpload} from "../components/imageUpload"
// import ImageUpload from "../components/imageUpload2"
// import Uploader from "../components/uploader3"
// import Uploader4 from "../components/uploader4"
// import {Demo} from "../components/demo"
// import {ReactCroper} from "../components/reactCroper"
import ImageUploadAndCrop from "../components/ImageUploadAndCrop"
import {Stepper, Button, Group} from "@mantine/core"
import {Clock, Photo, Palette, CircleCheck} from "tabler-icons-react"

// import Step1Options from "../components/step1/options"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const Home = () => {
  const [image, setImage] = useState("")
  const [isUploaded, setIsUploaded] = useState(false)

  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)
  const [replicateKey, setReplicateKey] = useState("")

  // Stepper
  const [active, setActive] = useState(0)
  const [highestStepVisited, setHighestStepVisited] = useState(active)

  const handleStepChange = (nextStep) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0
    if (isOutOfBounds) {
      return
    }
    setActive(nextStep)
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep))
  }

  const prevStep = () => handleStepChange(active - 1)
  const nextStep = () => handleStepChange(active + 1)

  // Allow the user to freely go back and forth between visited steps,
  // and to the second step only if there's a selectedImage
  const shouldAllowSelectStep = (step) =>
    highestStepVisited >= step &&
    active !== step &&
    (step !== 1 || (step === 1 && selectedImage))

  const {selectedImage, setSelectedImage} = useAppContext()

  function handleImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader()

      reader.onload = function (e) {
        setImage(e.target.result)
        setIsUploaded(true)
      }

      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleImageSelect = (imageUrl) => {
    console.log("selected image:", imageUrl)
    setSelectedImage(imageUrl)
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
      const response = await fetch("/api/predictions/" + prediction.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replicateKey: replicateKey,
        }),
      })
      prediction = await response.json()
      if (response.status !== 200) {
        setError(prediction.detail)
        return
      }
      console.log(JSON.stringify(prediction, null, 2))
      setPrediction(prediction)
    }
  }

  useEffect(() => {
    console.log(typeof selectedImage)
    console.log(selectedImage)
  })

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
      <>
        <Stepper
          active={active}
          onStepClick={setActive}
          completedIcon={<CircleCheck />}
        >
          <Stepper.Step
            icon={<Photo size="1.1rem" />}
            label="Base Image"
            description="Select your base image"
            color="black"
            allowStepSelect={shouldAllowSelectStep(0)}
          >
            <h1 className="py-2 text-center font-bold text-3xl pt-4">
              Select your base photo
            </h1>
            <h1 className="py-4 text-center font-bold text-2xl">
              {/* Upload an image or  */}
              Dream an image
            </h1>
            {error && <div>{error}</div>}
            <div className="max-w-2xl pt-2">
              {/* <Step1Options /> */}
              <ImageUploadAndCrop />
            </div>
            <div>
              <p className="font-semibold text-center py-2">Or</p>
            </div>
            <div className="max-w-[512px] pt-2 mx-auto">
              {prediction ? (
                <div className="grid grid-cols-2 gap-2">
                  {prediction.output ? (
                    <>
                      {prediction.output.map((imageUrl, index) => (
                        <div
                          key={index}
                          className={`mx-auto ${
                            selectedImage === imageUrl
                              ? "border-4 border-teal-500"
                              : ""
                          }`}
                          onClick={() => handleImageSelect(imageUrl)}
                        >
                          <Image
                            src={imageUrl}
                            alt="output"
                            width={250}
                            height={250}
                            className="cursor-pointer rounded-sm hover:ring-4 hover:ring-teal-500 transition-all"
                          />
                        </div>
                      ))}
                    </>
                  ) : null}
                </div>
              ) : null}
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
          </Stepper.Step>
          <Stepper.Step
            icon={<Palette size="1.1rem" />}
            label="Create"
            description="Generate your prompts"
            color="black"
            allowStepSelect={shouldAllowSelectStep(1)}
          >
            <CreateVideoForm />
          </Stepper.Step>
          <Stepper.Step
            icon={<Clock size="1.1rem" />}
            label="Wait"
            description="Wait for the AI"
            color="black"
            allowStepSelect={shouldAllowSelectStep(2)}
          >
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button
            variant="default"
            onClick={nextStep}
            disabled={selectedImage ? false : true}
          >
            Next step
          </Button>
        </Group>
      </>
    </div>
  )
}

export default Home
