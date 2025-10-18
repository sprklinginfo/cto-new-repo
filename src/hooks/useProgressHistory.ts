import { useCallback, useState } from 'react'
import {
  addProgressEntry,
  clearProgressHistory,
  getProgressHistory,
  removeProgressEntry,
  updateProgressEntry,
} from '../services/progressService'
import type { ProgressEntry } from '../types/mock'

export const useProgressHistory = () => {
  const [history, setHistory] = useState<ProgressEntry[]>(() => getProgressHistory())

  const add = useCallback((entry: ProgressEntry) => setHistory(addProgressEntry(entry)), [])
  const update = useCallback((id: string, patch: Partial<ProgressEntry>) => {
    setHistory(updateProgressEntry(id, patch))
  }, [])
  const remove = useCallback((id: string) => setHistory(removeProgressEntry(id)), [])
  const clear = useCallback(() => {
    clearProgressHistory()
    setHistory([])
  }, [])

  return { history, add, update, remove, clear }
}
