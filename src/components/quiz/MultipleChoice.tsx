import { memo, useMemo } from 'react'
import { Button, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import type { MultipleChoiceQuestion } from '../../types/mock'

export type MultipleChoiceProps = {
  question: MultipleChoiceQuestion
  selectedId?: string
  disabled?: boolean
  reveal?: boolean
  onSelect: (optionId: string) => void
}

const MultipleChoice = ({ question, selectedId, disabled, reveal, onSelect }: MultipleChoiceProps) => {
  const correctId = question.correctOptionId

  const getVariant = useMemo(() => {
    return (id: string) => {
      if (!reveal) return id === selectedId ? 'solid' : 'outline'
      if (id === correctId) return 'solid'
      if (id === selectedId && id !== correctId) return 'outline'
      return 'outline'
    }
  }, [reveal, selectedId, correctId])

  const getColor = useMemo(() => {
    return (id: string) => {
      if (!reveal) return 'brand'
      if (id === correctId) return 'green'
      if (id === selectedId && id !== correctId) return 'red'
      return 'gray'
    }
  }, [reveal, selectedId, correctId])

  return (
    <Stack spacing={3}>
      <Text>{question.prompt}</Text>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
        {question.options.map((o) => (
          <Button
            key={o.id}
            onClick={() => onSelect(o.id)}
            isDisabled={disabled}
            colorScheme={getColor(o.id)}
            variant={getVariant(o.id) as any}
            justifyContent="flex-start"
          >
            {o.text}
          </Button>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default memo(MultipleChoice)
