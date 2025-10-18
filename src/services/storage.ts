const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const safeStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // ignore write errors (quota, privacy mode)
    }
  },
  removeItem: (key: string): void => {
    if (!isBrowser) return
    try {
      window.localStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
}

export const storageKeys = {
  vocabSets: 'll_vocab_sets',
  quizzes: 'll_quizzes',
  achievements: 'll_achievements',
  favorites: 'll_favorites',
  quizAttempts: 'll_quiz_attempts',
  progressHistory: 'll_progress_history',
} as const

export const readJSON = <T>(key: string, fallback: T): T => {
  const raw = safeStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const writeJSON = <T>(key: string, value: T): void => {
  try {
    const raw = JSON.stringify(value)
    safeStorage.setItem(key, raw)
  } catch {
    // ignore
  }
}

export const updateJSON = <T>(key: string, updater: (prev: T) => T, fallback: T): T => {
  const prev = readJSON<T>(key, fallback)
  const next = updater(prev)
  writeJSON<T>(key, next)
  return next
}

export const clearKey = (key: string): void => {
  safeStorage.removeItem(key)
}
