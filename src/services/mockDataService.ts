import type {
  AchievementsPayload,
  Quiz,
  VocabularyPayload,
} from '../types/mock'
import { readJSON, storageKeys, writeJSON, clearKey } from './storage'

const JSON_PATHS = {
  vocab: '/mock/vocabulary.json',
  quizzes: '/mock/quizzes.json',
  achievements: '/mock/achievements.json',
} as const

const fetchJSON = async <T>(path: string): Promise<T> => {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`)
  }
  return (await res.json()) as T
}

export const loadVocabularySets = async () => {
  const cached = readJSON<VocabularyPayload | null>(storageKeys.vocabSets, null)
  if (cached) return cached.sets
  try {
    const payload = await fetchJSON<VocabularyPayload>(JSON_PATHS.vocab)
    writeJSON(storageKeys.vocabSets, payload)
    return payload.sets
  } catch (e) {
    console.error(e)
    return []
  }
}

export const loadQuizzes = async (): Promise<Quiz[]> => {
  const cached = readJSON<Quiz[] | null>(storageKeys.quizzes, null)
  if (cached) return cached
  try {
    const payload = await fetchJSON<Quiz[]>(JSON_PATHS.quizzes)
    writeJSON(storageKeys.quizzes, payload)
    return payload
  } catch (e) {
    console.error(e)
    return []
  }
}

export const loadAchievements = async () => {
  const cached = readJSON<AchievementsPayload | null>(storageKeys.achievements, null)
  if (cached) return cached.achievements
  try {
    const payload = await fetchJSON<AchievementsPayload>(JSON_PATHS.achievements)
    writeJSON(storageKeys.achievements, payload)
    return payload.achievements
  } catch (e) {
    console.error(e)
    return []
  }
}

export const seedAllMockData = async (): Promise<void> => {
  await Promise.all([loadVocabularySets(), loadQuizzes(), loadAchievements()])
}

export const resetMockData = (): void => {
  clearKey(storageKeys.vocabSets)
  clearKey(storageKeys.quizzes)
  clearKey(storageKeys.achievements)
}
