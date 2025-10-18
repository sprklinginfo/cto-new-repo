import { memo } from 'react'
import { Button, HStack, Input, Stack, Text } from '@chakra-ui/react'
import type { FillInQuestion } from '../../types/mock'

export type FillInProps = {
  question: FillInQuestion
  value: string
  disabled?: boolean
  onChange: (v: string) => void
  onSubmit?: () => void
}

const FillIn = ({ question, value, disabled, onChange, onSubmit }: FillInProps) => {
  const submit = () => onSubmit?.()

  return (
    <Stack spacing={3}>
      <Text>{question.prompt}</Text>
      <HStack>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer"
          isDisabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
        <Button colorScheme="brand" onClick={submit} isDisabled={disabled}>
          Submit
        </Button>
      </HStack>
    </Stack>
  )
}

export default memo(FillIn)
