import { useCallback, useEffect, useState } from 'react'
import {
  addFavorite,
  clearFavorites,
  getFavorites,
  isFavorite as isFavoriteFn,
  removeFavorite,
  toggleFavorite,
  type Favorite,
} from '../services/favoritesService'

const STORAGE_EVENT = 'storage'

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>(() => getFavorites())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'll_favorites') setFavorites(getFavorites())
    }
    window.addEventListener(STORAGE_EVENT, onStorage)
    return () => window.removeEventListener(STORAGE_EVENT, onStorage)
  }, [])

  const add = useCallback((id: Favorite) => setFavorites(addFavorite(id)), [])
  const remove = useCallback((id: Favorite) => setFavorites(removeFavorite(id)), [])
  const toggle = useCallback((id: Favorite) => setFavorites(toggleFavorite(id)), [])
  const clear = useCallback(() => {
    clearFavorites()
    setFavorites([])
  }, [])
  const isFavorite = useCallback((id: Favorite) => isFavoriteFn(id), [])

  return { favorites, add, remove, toggle, clear, isFavorite }
}
