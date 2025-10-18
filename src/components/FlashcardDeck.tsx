import { Box, Button, HStack, Progress, Stack, Text } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { VocabularyItem } from '../types/mock'
import Flashcard from './Flashcard'
import { readJSON, writeJSON } from '../services/storage'
import { useFavorites } from '../hooks/useFavorites'
import WordDetailModal from './WordDetailModal'

export type FlashcardDeckProps = {
  items: VocabularyItem[]
  storageKey?: string
}

const FlashcardDeck = ({ items, storageKey = 'll_learn_last_index' }: FlashcardDeckProps) => {
  const maxIndex = Math.max(0, items.length - 1)
  const initialIndex = useMemo(() => readJSON<number>(storageKey, 0), [storageKey])
  const [index, setIndex] = useState<number>(() => Math.min(initialIndex, maxIndex))

  useEffect(() => {
    writeJSON<number>(storageKey, index)
  }, [index, storageKey])

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const { favorites, toggle, isFavorite } = useFavorites()

  const current = items[index]

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, maxIndex)), [maxIndex])
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])

  const onSwipe = useCallback((dir: 'left' | 'right') => {
    if (dir === 'left') next()
    else prev()
  }, [next, prev])

  const [showDetail, setShowDetail] = useState(false)

  return (
    <Stack spacing={4}>
      <Box>
        <Progress value={items.length ? ((index + 1) / items.length) * 100 : 0} borderRadius="md" />
        <HStack mt={2} justify="space-between">
          <Text fontSize="sm" color="gray.600">{index + 1} / {items.length}</Text>
          <Text fontSize="sm" color="gray.500">Favorites: {favorites.length}</Text>
        </HStack>
      </Box>

      {current ? (
        <Flashcard
          item={current}
          onSwipe={onSwipe}
          onLongPress={() => setShowDetail(true)}
          isFavorite={isFavorite(current.id)}
          onToggleFavorite={() => toggle(current.id)}
        />
      ) : (
        <Box borderWidth="1px" borderRadius="lg" p={6} textAlign="center">No items</Box>
      )}

      <HStack justify="space-between">
        <Button onClick={prev} isDisabled={index === 0} variant="outline" colorScheme="brand">
          Prev
        </Button>
        <Button onClick={next} isDisabled={index === maxIndex} colorScheme="brand">
          Next
        </Button>
      </HStack>

      <WordDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        item={current ?? null}
        isFavorite={current ? isFavorite(current.id) : false}
        onToggleFavorite={() => current && toggle(current.id)}
      />
    </Stack>
  )
}

export default FlashcardDeck
