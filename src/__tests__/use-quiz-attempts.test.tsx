import { renderHook, act } from '@testing-library/react'
import { useQuizAttempts } from '../hooks/useQuizAttempts'
import { storageKeys, writeJSON } from '../services/storage'
import type { QuizAttempt } from '../types/mock'

const makeAttempt = (id: string, quizId = 'quiz-1', score = 3): QuizAttempt => ({
  id,
  quizId,
  timestamp: new Date().toISOString(),
  score,
  results: [],
})

describe('useQuizAttempts', () => {
  beforeEach(() => {
    writeJSON<QuizAttempt[]>(storageKeys.quizAttempts, [])
  })

  it('adds attempts and exposes them', () => {
    const { result } = renderHook(() => useQuizAttempts())

    act(() => {
      result.current.add(makeAttempt('a1'))
      result.current.add(makeAttempt('a2', 'quiz-2', 5))
    })

    expect(result.current.attempts.length).toBe(2)
    expect(result.current.attempts[1].score).toBe(5)
  })

  it('filters by quizId when provided', () => {
    const all = [makeAttempt('x1', 'q1', 1), makeAttempt('x2', 'q2', 2)]
    writeJSON<QuizAttempt[]>(storageKeys.quizAttempts, all)

    const { result, rerender } = renderHook(({ id }: { id?: string }) => useQuizAttempts(id), {
      initialProps: { id: undefined },
    })

    expect(result.current.attempts.length).toBe(2)

    rerender({ id: 'q1' })
    expect(result.current.attempts.length).toBe(1)
    expect(result.current.attempts[0].quizId).toBe('q1')
  })
})
