import { memo } from 'react'
import { Badge, Button, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import type { OrderingQuestion } from '../../types/mock'

export type OrderingProps = {
  question: OrderingQuestion
  value: string[]
  disabled?: boolean
  onChange: (next: string[]) => void
  onSubmit?: () => void
}

const Ordering = ({ question, value, disabled, onChange, onSubmit }: OrderingProps) => {
  const allWords = question.words

  const onTokenClick = (w: string) => {
    if (disabled) return
    if (value.includes(w)) return
    onChange([...value, w])
  }

  const removeLast = () => {
    if (disabled) return
    onChange(value.slice(0, -1))
  }

  const reset = () => {
    if (disabled) return
    onChange([])
  }

  const submit = () => onSubmit?.()

  return (
    <Stack spacing={3}>
      <Text>{question.prompt}</Text>
      <HStack flexWrap="wrap" gap={2}>
        {value.length === 0 ? (
          <Badge colorScheme="gray">Tap words to build the sentence</Badge>
        ) : (
          value.map((w, idx) => (
            <Badge key={`${w}-${idx}`} colorScheme="brand" fontSize="md" px={3} py={1} borderRadius="full">
              {w}
            </Badge>
          ))
        )}
      </HStack>
      <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={2}>
        {allWords.map((w, idx) => {
          const picked = value.includes(w)
          return (
            <Button
              key={`${w}-${idx}`}
              onClick={() => onTokenClick(w)}
              isDisabled={picked || disabled}
              variant={picked ? 'outline' : 'solid'}
              colorScheme={picked ? 'gray' : 'brand'}
            >
              {w}
            </Button>
          )
        })}
      </SimpleGrid>
      <HStack>
        <Button onClick={removeLast} isDisabled={disabled || value.length === 0} variant="ghost">
          Backspace
        </Button>
        <Button onClick={reset} isDisabled={disabled || value.length === 0} variant="outline">
          Reset
        </Button>
        <Button onClick={submit} isDisabled={disabled || value.length !== allWords.length} colorScheme="brand">
          Submit
        </Button>
      </HStack>
    </Stack>
  )
}

export default memo(Ordering)
