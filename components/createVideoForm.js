import {useState, useContext} from "react"
import {appContext} from "../context/context.js"
import {Button} from "@mantine/core"
import {Video} from "tabler-icons-react"
import PromptsInputs from "./step2/promptsInputs"

export default function CreateVideoForm() {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12">
      <PromptsInputs />
    </div>
  )
}
