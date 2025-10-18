import { readJSON, storageKeys, writeJSON } from './storage'
import type { QuizAttempt } from '../types/mock'

const empty: QuizAttempt[] = []

export const getQuizAttempts = (): QuizAttempt[] => {
  return readJSON<QuizAttempt[]>(storageKeys.quizAttempts, empty)
}

export const getAttemptsByQuiz = (quizId: string): QuizAttempt[] => {
  return getQuizAttempts().filter((a) => a.quizId === quizId)
}

export const addQuizAttempt = (attempt: QuizAttempt): QuizAttempt[] => {
  const next = [...getQuizAttempts(), attempt]
  writeJSON<QuizAttempt[]>(storageKeys.quizAttempts, next)
  return next
}

export const updateQuizAttempt = (id: string, patch: Partial<QuizAttempt>): QuizAttempt[] => {
  const next = getQuizAttempts().map((a) => (a.id === id ? { ...a, ...patch } : a))
  writeJSON<QuizAttempt[]>(storageKeys.quizAttempts, next)
  return next
}

export const removeQuizAttempt = (id: string): QuizAttempt[] => {
  const next = getQuizAttempts().filter((a) => a.id !== id)
  writeJSON<QuizAttempt[]>(storageKeys.quizAttempts, next)
  return next
}

export const clearQuizAttempts = (): void => {
  writeJSON<QuizAttempt[]>(storageKeys.quizAttempts, [])
}
