import { readJSON, storageKeys, writeJSON } from './storage'
import type { ProgressEntry } from '../types/mock'

const empty: ProgressEntry[] = []

export const getProgressHistory = (): ProgressEntry[] => {
  return readJSON<ProgressEntry[]>(storageKeys.progressHistory, empty)
}

export const addProgressEntry = (entry: ProgressEntry): ProgressEntry[] => {
  const next = [...getProgressHistory(), entry]
  writeJSON<ProgressEntry[]>(storageKeys.progressHistory, next)
  return next
}

export const updateProgressEntry = (
  id: string,
  patch: Partial<ProgressEntry>,
): ProgressEntry[] => {
  const next = getProgressHistory().map((e) => (e.id === id ? { ...e, ...patch } : e))
  writeJSON<ProgressEntry[]>(storageKeys.progressHistory, next)
  return next
}

export const removeProgressEntry = (id: string): ProgressEntry[] => {
  const next = getProgressHistory().filter((e) => e.id !== id)
  writeJSON<ProgressEntry[]>(storageKeys.progressHistory, next)
  return next
}

export const clearProgressHistory = (): void => {
  writeJSON<ProgressEntry[]>(storageKeys.progressHistory, [])
}
