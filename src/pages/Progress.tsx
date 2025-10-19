import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'
import TrendChart from '../components/TrendChart'
import AchievementBadge from '../components/AchievementBadge'
import { useAchievements, useQuizzes, useSeedMockData } from '../hooks/useMockData'
import { useQuizAttempts } from '../hooks/useQuizAttempts'
import {
  averageAccuracy,
  buildQuestionToVocabIndex,
  computeCurrentStreak,
  computeDailyActivity,
  computeMonthlyActivity,
  computeUniqueWordsMastered,
  computeWeeklyActivity,
  evaluateAchievements,
} from '../utils/analytics'

const Progress = () => {
  useSeedMockData()
  const { attempts } = useQuizAttempts()
  const { data: quizzes } = useQuizzes()
  const { data: achievements, loading: achievementsLoading } = useAchievements()

  const q2v = useMemo(() => buildQuestionToVocabIndex(quizzes), [quizzes])

  const wordsMastered = useMemo(() => computeUniqueWordsMastered(attempts, q2v), [attempts, q2v])
  const quizzesCompleted = attempts.length
  const streak = useMemo(() => computeCurrentStreak(attempts), [attempts])

  const daily = useMemo(() => computeDailyActivity(attempts, 14), [attempts])
  const weekly = useMemo(() => computeWeeklyActivity(attempts, 8), [attempts])
  const monthly = useMemo(() => computeMonthlyActivity(attempts, 6), [attempts])

  const [agg, setAgg] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const activeSeries = agg === 'daily' ? daily : agg === 'weekly' ? weekly : monthly
  const accuracy = averageAccuracy(daily.slice(-7))

  const resolvedAchievements = useMemo(
    () => evaluateAchievements(achievements, { streak, quizzesCompleted, wordsMastered }),
    [achievements, streak, quizzesCompleted, wordsMastered],
  )

  return (
    <Stack spacing={4}>
      <Heading size="lg">Progress Pulse</Heading>
      <Text color="gray.600">Your learning streak, vocabulary growth, and study trends.</Text>

      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        <Stat bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <StatLabel>Streak</StatLabel>
          <StatNumber>{streak} {streak === 1 ? 'day' : 'days'}</StatNumber>
          <StatHelpText>Keep it going</StatHelpText>
        </Stat>
        <Stat bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <StatLabel>Words mastered</StatLabel>
          <StatNumber>{wordsMastered}</StatNumber>
          <StatHelpText>Unique words from correct answers</StatHelpText>
        </Stat>
        <Stat bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <StatLabel>Accuracy</StatLabel>
          <StatNumber>{accuracy}%</StatNumber>
          <StatHelpText>Last 7 days</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Card borderWidth="1px" borderRadius="xl" bg="white">
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="md">Study activity</Heading>
            <ButtonGroup size="sm" isAttached>
              {(['daily', 'weekly', 'monthly'] as const).map((k) => (
                <Button
                  key={k}
                  onClick={() => setAgg(k)}
                  aria-pressed={agg === k}
                  variant={agg === k ? 'solid' : 'outline'}
                  colorScheme="brand"
                >
                  {k}
                </Button>
              ))}
            </ButtonGroup>
          </HStack>
        </CardHeader>
        <CardBody>
          {attempts.length === 0 ? (
            <HStack>
              <Spinner size="sm" />
              <Text color="gray.600">Take a quiz to see your chart</Text>
            </HStack>
          ) : (
            <TrendChart
              data={activeSeries.map((p) => ({ label: p.label, value: p.sessions }))}
              ariaLabel={`Study sessions per ${agg}`}
            />
          )}
        </CardBody>
      </Card>

      <Box>
        <Heading size="md" mb={3}>Achievements</Heading>
        {achievementsLoading ? (
          <Text>Loading achievements…</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
            {resolvedAchievements.map((a) => (
              <AchievementBadge key={a.id} title={a.title} description={a.description} icon={a.icon} unlocked={a.unlocked} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Stack>
  )
}

export default Progress
