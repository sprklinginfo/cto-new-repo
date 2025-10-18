import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useQuizzes } from '../hooks/useMockData'
import type {
  FillInQuestion,
  ListeningQuestion,
  MultipleChoiceQuestion,
  OrderingQuestion,
  Quiz,
  QuizQuestion,
  QuestionResult,
  QuizAttempt,
} from '../types/mock'
import MultipleChoice from '../components/quiz/MultipleChoice'
import FillIn from '../components/quiz/FillIn'
import Listening from '../components/quiz/Listening'
import Ordering from '../components/quiz/Ordering'
import Timer from '../components/quiz/Timer'
import FeedbackIndicator from '../components/quiz/FeedbackIndicator'
import { useQuizAttempts } from '../hooks/useQuizAttempts'

const SECONDS_PER_QUESTION = 20

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const QuizRunner = () => {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { data: quizzes, loading } = useQuizzes()
  const quiz: Quiz | undefined = useMemo(
    () => quizzes.find((q) => q.id === quizId),
    [quizzes, quizId],
  )

  const { add } = useQuizAttempts(quizId)

  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<QuestionResult[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle')
  const [mcSelected, setMcSelected] = useState<string | undefined>()
  const [textValue, setTextValue] = useState('')
  const [orderedWords, setOrderedWords] = useState<string[]>([])
  const [shuffledMap, setShuffledMap] = useState<Record<string, string[]>>({})
  const startedAtRef = useRef<number | null>(null)

  const q: QuizQuestion | undefined = quiz?.questions[idx]

  useEffect(() => {
    if (!quiz) return
    // precompute shuffles for ordering questions
    const map: Record<string, string[]> = {}
    quiz.questions.forEach((qq) => {
      if (qq.type === 'ordering') {
        const o = qq as OrderingQuestion
        map[qq.id] = shuffle(o.words)
      }
    })
    setShuffledMap(map)
  }, [quiz])

  useEffect(() => {
    // reset per-question state
    setSubmitted(false)
    setFeedbackState('idle')
    setMcSelected(undefined)
    setTextValue('')
    setOrderedWords([])
  }, [idx])

  useEffect(() => {
    if (!quiz) return
    if (idx === 0) startedAtRef.current = performance.now()
  }, [quiz, idx])

  const isCorrect = useMemo(() => {
    if (!q) return false
    if (q.type === 'multiple_choice') return mcSelected === (q as MultipleChoiceQuestion).correctOptionId
    if (q.type === 'fill_in') return textValue.trim().toLowerCase() === (q as FillInQuestion).answer.trim().toLowerCase()
    if (q.type === 'listening') return textValue.trim().toLowerCase() === (q as ListeningQuestion).answer.trim().toLowerCase()
    if (q.type === 'ordering') return orderedWords.join(' ') === (q as OrderingQuestion).words.join(' ')
    return false
  }, [q, mcSelected, textValue, orderedWords])

  const handleSubmit = useCallback(() => {
    if (!q || submitted) return
    setSubmitted(true)
    setFeedbackState(isCorrect ? 'correct' : 'incorrect')
    const result: QuestionResult = {
      questionId: q.id,
      correct: isCorrect,
      userAnswer: q.type === 'ordering' ? orderedWords.join(' ') : textValue,
      selectedOptionId: q.type === 'multiple_choice' ? mcSelected : undefined,
    }
    setResults((r) => [...r, result])
    if (isCorrect) setScore((s) => s + 1)
  }, [q, submitted, isCorrect, orderedWords, textValue, mcSelected])

  const onExpire = useCallback(() => {
    if (submitted) return
    handleSubmit()
  }, [submitted, handleSubmit])

  const next = useCallback(() => {
    if (!quiz) return
    if (idx < quiz.questions.length - 1) {
      setIdx((i) => i + 1)
    } else {
      // finish quiz
      const durationSec = startedAtRef.current ? Math.round((performance.now() - startedAtRef.current) / 1000) : undefined
      const attempt: QuizAttempt = {
        id: Date.now().toString(),
        quizId: quiz.id,
        timestamp: new Date().toISOString(),
        durationSec,
        score,
        results,
      }
      add(attempt)
      navigate('/practice', { replace: true, state: { completed: true } })
    }
  }, [idx, quiz, score, results, add, navigate])

  if (loading) {
    return (
      <HStack>
        <Spinner />
        <Text>Loading quiz…</Text>
      </HStack>
    )
  }

  if (!quiz || !q) {
    return <Text color="red.500">Quiz not found</Text>
  }

  const total = quiz.questions.length
  const orderOptions = q.type === 'ordering' ? (shuffledMap[q.id] ?? (q as OrderingQuestion).words) : []

  return (
    <Stack spacing={4}>
      <Heading size="md">{quiz.title}</Heading>
      <HStack justify="space-between">
        <Text>
          Question {idx + 1}/{total}
        </Text>
        <Text>Score: {score}</Text>
      </HStack>

      <Card borderWidth="1px" borderRadius="xl" bg="white">
        <CardHeader>
          <Timer seconds={SECONDS_PER_QUESTION} running={!submitted} onExpire={onExpire} />
        </CardHeader>
        <CardBody>
          {q.type === 'multiple_choice' && (
            <MultipleChoice
              question={q as MultipleChoiceQuestion}
              selectedId={mcSelected}
              disabled={submitted}
              reveal={submitted}
              onSelect={(id) => setMcSelected(id)}
            />
          )}
          {q.type === 'fill_in' && (
            <FillIn
              question={q as FillInQuestion}
              value={textValue}
              disabled={submitted}
              onChange={setTextValue}
              onSubmit={handleSubmit}
            />
          )}
          {q.type === 'listening' && (
            <Listening
              question={q as ListeningQuestion}
              value={textValue}
              disabled={submitted}
              onChange={setTextValue}
              onSubmit={handleSubmit}
            />
          )}
          {q.type === 'ordering' && (
            <Ordering
              question={{ ...(q as OrderingQuestion), words: orderOptions }}
              value={orderedWords}
              disabled={submitted}
              onChange={setOrderedWords}
              onSubmit={handleSubmit}
            />
          )}

          <Box mt={4}>
            <FeedbackIndicator state={feedbackState} />
          </Box>
          {submitted && (
            <HStack mt={4} justify="flex-end">
              <Button colorScheme="brand" onClick={next}>
                {idx === total - 1 ? 'Finish' : 'Next'}
              </Button>
            </HStack>
          )}
        </CardBody>
      </Card>
    </Stack>
  )
}

export default QuizRunner
