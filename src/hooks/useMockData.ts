import { useEffect, useState } from 'react'
import type { Achievement, Quiz, VocabularySet } from '../types/mock'
import { loadAchievements, loadQuizzes, loadVocabularySets, seedAllMockData } from '../services/mockDataService'

export const useSeedMockData = () => {
  useEffect(() => {
    // Seed on first mount
    void seedAllMockData()
  }, [])
}

type AsyncState<T> = {
  data: T
  loading: boolean
  error: string | null
}

export const useVocabularySets = (): AsyncState<VocabularySet[]> => {
  const [state, setState] = useState<AsyncState<VocabularySet[]>>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const sets = await loadVocabularySets()
        if (!cancelled) setState({ data: sets, loading: false, error: null })
      } catch (e) {
        if (!cancelled) setState({ data: [], loading: false, error: (e as Error).message })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export const useQuizzes = (): AsyncState<Quiz[]> => {
  const [state, setState] = useState<AsyncState<Quiz[]>>({ data: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const quizzes = await loadQuizzes()
        if (!cancelled) setState({ data: quizzes, loading: false, error: null })
      } catch (e) {
        if (!cancelled) setState({ data: [], loading: false, error: (e as Error).message })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

export const useAchievements = (): AsyncState<Achievement[]> => {
  const [state, setState] = useState<AsyncState<Achievement[]>>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await loadAchievements()
        if (!cancelled) setState({ data: list, loading: false, error: null })
      } catch (e) {
        if (!cancelled) setState({ data: [], loading: false, error: (e as Error).message })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
