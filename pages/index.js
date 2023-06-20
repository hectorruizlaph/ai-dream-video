import {useState, useEffect} from "react"
import Head from "next/head"
import Image from "next/image"
import {useAppContext} from "../context/context"
// import CreateVideoForm from "../components/createVideoForm"
import PromptsInputs from "../components/step2/promptsInputs"
import ImageUploadAndCrop from "../components/ImageUploadAndCrop"
import VideoOutput from "../components/step3/videoOutput"
import {Stepper, Button, Group, Tooltip} from "@mantine/core"
import {
  Clock,
  Photo,
  Palette,
  CircleCheck,
  ChevronRight,
} from "tabler-icons-react"

// import Step1Options from "../components/step1/options"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const Home = () => {
  const [prediction, setPrediction] = useState(null)
  const [loadingPrediction, setLoadingPrediction] = useState(false)
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

  const {
    selectedImage,
    setSelectedImage,
    animationPrompts,
    handleSubmitCreateVideo,
    videoURL,
  } = useAppContext()

  const handleImageSelect = (imageUrl) => {
    console.log("selected image:", imageUrl)
    setSelectedImage(imageUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingPrediction(true)
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
      setLoadingPrediction(false)
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
        setLoadingPrediction(false)
        return
      }
      console.log(JSON.stringify(prediction, null, 2))
      setPrediction(prediction)
      if (prediction.output && prediction.output.length >= 3) {
        setLoadingPrediction(false)
      }
    }
  }

  useEffect(() => {
    console.log(typeof selectedImage)
    console.log(selectedImage)
    console.log("animationPrompts: ", animationPrompts)

    if (selectedImage) {
      handleStepChange(active + 1)
    }
  }, [selectedImage])

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
      <p className="pb-8">
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
              Choose your base image
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
              <Button
                variant="default"
                color="dark"
                size="md"
                type="submit"
                rightIcon={<Photo size="1rem" />}
                loading={loadingPrediction}
              >
                Generate Image
              </Button>
              {/* <button
                className="button"
                type="submit"
                disabled={loadingPrediction}
              >
                Generate Image
              </button> */}
            </form>
          </Stepper.Step>
          <Stepper.Step
            icon={<Palette size="1.1rem" />}
            label="Create"
            description="Generate your prompts"
            color="black"
            allowStepSelect={shouldAllowSelectStep(1)}
          >
            {/* <CreateVideoForm /> */}
            <PromptsInputs />
          </Stepper.Step>
          <Stepper.Step
            icon={<Clock size="1.1rem" />}
            label="Wait"
            description="Get video"
            color="black"
            allowStepSelect={shouldAllowSelectStep(2)}
          >
            <VideoOutput />
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group position="center" mt="xl">
          <Button
            variant="default"
            onClick={prevStep}
            className={active === 0 ? "hidden" : "block"}
            color="dark"
          >
            Back
          </Button>
          <Tooltip
            label={
              (active === 0 && "Select your base image") ||
              (active === 1 && "Create your prompts")
              // animationPrompts === "50: A beautiful forest" &&
              // "Create your prompts")
            }
            position="bottom"
            withArrow
            disabled={active !== 0 ? true : false}
          >
            <div>
              <Button
                variant="default"
                onClick={() => {
                  if (active === 1) {
                    if (!videoURL) handleSubmitCreateVideo()
                    nextStep()
                  } else {
                    nextStep()
                  }
                }}
                disabled={
                  !selectedImage ||
                  (active === 1 && !animationPrompts) ||
                  (active === 1 &&
                    animationPrompts === "50: A beautiful forest") ||
                  videoURL
                }
                color="dark"
                rightIcon={<ChevronRight size="1rem" />}
              >
                {active === 0
                  ? "Use Image"
                  : active === 1
                  ? "Create Video"
                  : "Next"}
              </Button>
              {active === 1 && videoURL && (
                <Button
                  variant="default"
                  onClick={nextStep}
                  color="dark"
                  rightIcon={<ChevronRight size="1rem" />}
                >
                  See Video
                </Button>
              )}
            </div>
          </Tooltip>
        </Group>
      </>
    </div>
  )
}

export default Home
