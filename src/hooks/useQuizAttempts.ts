import { useCallback, useEffect, useState } from 'react'
import {
  addQuizAttempt,
  clearQuizAttempts,
  getAttemptsByQuiz,
  getQuizAttempts,
  removeQuizAttempt,
  updateQuizAttempt,
} from '../services/quizService'
import type { QuizAttempt } from '../types/mock'

export const useQuizAttempts = (quizId?: string) => {
  const initial = (): QuizAttempt[] => (quizId ? getAttemptsByQuiz(quizId) : getQuizAttempts())
  const [attempts, setAttempts] = useState<QuizAttempt[]>(initial)

  useEffect(() => {
    setAttempts(initial())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId])

  const add = useCallback((attempt: QuizAttempt) => setAttempts(addQuizAttempt(attempt)), [])
  const update = useCallback((id: string, patch: Partial<QuizAttempt>) => {
    setAttempts(updateQuizAttempt(id, patch))
  }, [])
  const remove = useCallback((id: string) => setAttempts(removeQuizAttempt(id)), [])
  const clear = useCallback(() => {
    clearQuizAttempts()
    setAttempts([])
  }, [])
  const refresh = useCallback(() => {
    setAttempts(initial())
  }, [quizId])

  return { attempts, add, update, remove, clear, refresh }
}
