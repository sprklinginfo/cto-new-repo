import { Box, Button, Card, CardBody, CardHeader, Heading, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useSeedMockData, useQuizzes } from '../hooks/useMockData'
import { useQuizAttempts } from '../hooks/useQuizAttempts'

const Practice = () => {
  useSeedMockData()
  const { data: quizzes, loading } = useQuizzes()
  const { attempts } = useQuizAttempts()

  const latestByQuiz = attempts.reduce<Record<string, { score: number; timestamp: string }>>((acc, a) => {
    const prev = acc[a.quizId]
    if (!prev || new Date(a.timestamp) > new Date(prev.timestamp)) acc[a.quizId] = { score: a.score, timestamp: a.timestamp }
    return acc
  }, {})

  return (
    <Stack spacing={4}>
      <Heading size="lg">Practice Arena</Heading>
      <Text color="gray.600">Quick quizzes adapted to your progress.</Text>

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
        {loading ? (
          <Text>Loading…</Text>
        ) : (
          quizzes.map((q) => (
            <Card key={q.id} borderWidth="1px" borderRadius="xl" bg="white">
              <CardHeader>
                <Heading size="md">{q.title}</Heading>
                <Text color="gray.500">Level {q.level ?? '—'}</Text>
              </CardHeader>
              <CardBody>
                <HStack justify="space-between">
                  <Box>
                    <Text fontSize="sm" color="gray.600">Questions: {q.questions.length}</Text>
                    {latestByQuiz[q.id] && (
                      <Text fontSize="sm" color="gray.600">Last score: {latestByQuiz[q.id].score}</Text>
                    )}
                  </Box>
                  <Button as={RouterLink} to={`/practice/${q.id}`} colorScheme="brand">
                    Start
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          ))
        )}
      </SimpleGrid>

      <Box bg="white" borderRadius="lg" borderWidth="1px" p={4}>
        <Text fontSize="sm" color="gray.600">Your attempts are saved locally so you can track progress.</Text>
      </Box>
    </Stack>
  )
}

export default Practice
