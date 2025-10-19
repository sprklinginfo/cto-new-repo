import { memo, useCallback, useMemo } from 'react'
import { Badge, Box, HStack, Stack, Text } from '@chakra-ui/react'
import type { QuizAttempt } from '../types/mock'
import { useQuizAttempts } from '../hooks/useQuizAttempts'
import VirtualList from './VirtualList'
import PullToRefresh from './PullToRefresh'

const formatDate = (iso: string) => new Date(iso).toLocaleString()

const AttemptRow = memo(({ a }: { a: QuizAttempt }) => {
  return (
    <HStack
      bg="white"
      borderWidth="1px"
      borderColor="gray.100"
      borderRadius="lg"
      px={3}
      py={2}
      justify="space-between"
    >
      <Stack spacing={0}>
        <Text fontWeight="600">Quiz {a.quizId}</Text>
        <Text fontSize="xs" color="gray.500">{formatDate(a.timestamp)}</Text>
      </Stack>
      <HStack spacing={2}>
        {typeof a.durationSec === 'number' ? (
          <Badge colorScheme="gray" borderRadius="full">{a.durationSec}s</Badge>
        ) : null}
        <Badge colorScheme="brand" borderRadius="full">Score {a.score}</Badge>
      </HStack>
    </HStack>
  )
})

const AttemptHistoryList = () => {
  const { attempts, clear, /* add, update, remove, */ refresh } = useQuizAttempts()

  const items = attempts
  const itemHeight = 56
  const height = 320

  const renderItem = useCallback((a: QuizAttempt) => <AttemptRow a={a} />, [])
  const keyExtractor = useCallback((a: QuizAttempt) => a.id, [])

  const onRefresh = useCallback(async () => {
    refresh()
  }, [refresh])

  const empty = useMemo(
    () => (
      <Box textAlign="center" color="gray.600" py={6} bg="white" borderRadius="lg" borderWidth="1px">
        No attempts yet. Complete a quiz to see history here.
      </Box>
    ),
    [],
  )

  if (items.length === 0) return empty

  return (
    <PullToRefresh onRefresh={onRefresh} height={height}>
      <VirtualList
        items={items}
        height={height}
        itemHeight={itemHeight}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <Box textAlign="center" mt={2}>
        <Text fontSize="xs" color="gray.500" cursor="pointer" onClick={clear}>Clear history</Text>
      </Box>
    </PullToRefresh>
  )
}

export default memo(AttemptHistoryList)
