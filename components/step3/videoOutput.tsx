import React, {useState, useEffect} from "react"
import {useForm} from "@mantine/form"
import {
  TextInput,
  Group,
  ActionIcon,
  Box,
  Text,
  Button,
  Code,
  Tooltip,
} from "@mantine/core"
import {randomId} from "@mantine/hooks"
import {Trash, Plus} from "tabler-icons-react"
import {useAppContext} from "../../context/context"

export default function VideoOutput() {
  const {animationPrompts, setAnimationPrompts} = useAppContext()

  const form = useForm({
    initialValues: {
      prompt: [{percentage: 50, name: "", key: randomId()}],
    },
  })

  const constant = 100

  const addPrompt = () => {
    const promptList = form.values.prompt
    const newPromptList = [
      ...promptList,
      {percentage: 0, name: "", key: randomId()},
    ]
    const increment = constant / (newPromptList.length + 1) // adjusted here

    newPromptList.forEach((prompt, index) => {
      prompt.percentage = Math.round((index + 1) * increment)
    })

    form.setFieldValue("prompt", newPromptList)
  }

  const removePrompt = (index) => {
    const newPromptList = form.values.prompt.filter((_, i) => i !== index)
    const increment = constant / (newPromptList.length + 1) // adjusted here

    newPromptList.forEach((prompt, index) => {
      prompt.percentage = Math.round((index + 1) * increment)
    })

    form.setFieldValue("prompt", newPromptList)
  }

  const fields = form.values.prompt.map((item, index) => (
    <Group key={item.key} mt="xs">
      <Text fz="xs">{item.percentage}</Text>
      <TextInput
        placeholder="A beautiful forest with a lake"
        withAsterisk
        sx={{flex: 1}}
        {...form.getInputProps(`prompt.${index}.name`)}
      />
      <ActionIcon color="red" onClick={() => removePrompt(index)}>
        <Trash size="1rem" />
      </ActionIcon>
    </Group>
  ))

  useEffect(() => {
    const promptsString = form.values.prompt
      .map(
        (prompt) =>
          `${prompt.percentage}: ${prompt.name || "A beautiful forest"}`
      )
      .join(" | ")
    setAnimationPrompts(promptsString)
    console.log(animationPrompts)
  }, [form.values])

  return (
    <Box maw={500} mx="auto">
      {fields.length > 0 ? (
        <Group mb="xs">
          <Text weight={500} size="sm" sx={{flex: 1}}>
            Prompts
          </Text>
        </Group>
      ) : (
        <Text color="dimmed" align="center">
          Add a prompt...
        </Text>
      )}

      {fields}

      <Group position="center" mt="md">
        <Tooltip
          label="Maximum 5 prompts"
          position="bottom"
          withArrow
          disabled={form.values.prompt.length !== 5}
        >
          <Button
            variant="default"
            color="dark"
            size="md"
            leftIcon={<Plus size="1rem" />}
            disabled={form.values.prompt.length >= 5}
            onClick={addPrompt}
          >
            Add Prompt
          </Button>
        </Tooltip>
      </Group>

      <Text size="sm" weight={500} mt="md">
        Form values:
      </Text>
      <Code block>{JSON.stringify(form.values, null, 2)}</Code>
    </Box>
  )
}
