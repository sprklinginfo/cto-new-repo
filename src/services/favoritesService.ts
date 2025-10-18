import { readJSON, storageKeys, writeJSON } from './storage'

export type Favorite = string // vocabulary item id

const empty: Favorite[] = []

export const getFavorites = (): Favorite[] => {
  return readJSON<Favorite[]>(storageKeys.favorites, empty)
}

export const setFavorites = (ids: Favorite[]): void => {
  writeJSON<Favorite[]>(storageKeys.favorites, Array.from(new Set(ids)))
}

export const addFavorite = (id: Favorite): Favorite[] => {
  const next = Array.from(new Set([...getFavorites(), id]))
  setFavorites(next)
  return next
}

export const removeFavorite = (id: Favorite): Favorite[] => {
  const next = getFavorites().filter((x) => x !== id)
  setFavorites(next)
  return next
}

export const toggleFavorite = (id: Favorite): Favorite[] => {
  const current = getFavorites()
  return current.includes(id) ? removeFavorite(id) : addFavorite(id)
}

export const isFavorite = (id: Favorite): boolean => {
  return getFavorites().includes(id)
}

export const clearFavorites = (): void => {
  setFavorites([])
}
