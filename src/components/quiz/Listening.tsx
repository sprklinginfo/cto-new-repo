import { memo } from 'react'
import { Button, HStack, Input, Stack, Text } from '@chakra-ui/react'
import type { ListeningQuestion } from '../../types/mock'
import { useAudio } from '../../contexts/AudioPlayerContext'

export type ListeningProps = {
  question: ListeningQuestion
  value: string
  disabled?: boolean
  onChange: (v: string) => void
  onSubmit?: () => void
}

const Listening = ({ question, value, disabled, onChange, onSubmit }: ListeningProps) => {
  const { play, isPlaying } = useAudio()

  const submit = () => onSubmit?.()

  return (
    <Stack spacing={3}>
      <Text>{question.prompt}</Text>
      <HStack>
        <Button onClick={() => play(question.audioUrl)} variant="outline" colorScheme="brand">
          {isPlaying ? 'Playing...' : 'Play'}
        </Button>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type what you hear"
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

export default memo(Listening)
