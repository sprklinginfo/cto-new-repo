import { memo } from 'react'
import { HStack, Icon, Text } from '@chakra-ui/react'

const Check = () => <span aria-hidden>✅</span>
const Cross = () => <span aria-hidden>❌</span>

export type FeedbackIndicatorProps = {
  state: 'idle' | 'correct' | 'incorrect'
  message?: string
}

const FeedbackIndicator = ({ state, message }: FeedbackIndicatorProps) => {
  if (state === 'idle') return null
  const isCorrect = state === 'correct'
  return (
    <HStack color={isCorrect ? 'green.600' : 'red.600'} fontWeight="600" spacing={2}>
      <Icon as={isCorrect ? Check : Cross} />
      <Text>{message ?? (isCorrect ? 'Correct' : 'Try again')}</Text>
    </HStack>
  )
}

export default memo(FeedbackIndicator)
