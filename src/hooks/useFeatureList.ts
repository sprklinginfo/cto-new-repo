import { useMemo } from 'react'
import { features, type Feature } from '../data/features'

export const useFeatureList = (): Feature[] => {
  return useMemo(() => features, [])
}
