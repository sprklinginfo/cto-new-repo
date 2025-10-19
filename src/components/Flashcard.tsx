import { Box, HStack, IconButton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { memo, useCallback, useRef, useState } from 'react'
import type { VocabularyItem } from '../types/mock'
import { useAudio } from '../contexts/AudioPlayerContext'

const MotionBox = motion(Box)

export type FlashcardProps = {
  item: VocabularyItem
  isFavorite: boolean
  onToggleFavorite: () => void
  onSwipe?: (dir: 'left' | 'right') => void
  onLongPress?: () => void
}

const SWIPE_THRESHOLD = 120
const LONG_PRESS_MS = 450
const MOVE_CANCEL_PX = 6

const Flashcard = ({ item, onSwipe, onLongPress, isFavorite, onToggleFavorite }: FlashcardProps) => {
  const { play, isPlaying } = useAudio()
  const [flipped, setFlipped] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const pressTimer = useRef<number | null>(null)
  const startXY = useRef<{ x: number; y: number } | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-160, 0, 160], [-10, 0, 10])
  const bg = useColorModeValue('white', 'gray.800')
  const border = useColorModeValue('gray.100', 'gray.700')

  const clearPressTimer = useCallback(() => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    clearPressTimer()
    startXY.current = { x: e.clientX, y: e.clientY }
    pressTimer.current = window.setTimeout(() => {
      onLongPress?.()
      pressTimer.current = null
    }, LONG_PRESS_MS)
  }, [clearPressTimer, onLongPress])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const start = startXY.current
    if (!start) return
    const dx = Math.abs(e.clientX - start.x)
    const dy = Math.abs(e.clientY - start.y)
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) clearPressTimer()
  }, [clearPressTimer])

  const handlePointerUp = useCallback(() => {
    clearPressTimer()
    startXY.current = null
  }, [clearPressTimer])

  const handleTap = useCallback(() => {
    if (isDragging) return
    setFlipped((f) => !f)
  }, [isDragging])

  return (
    <Box position="relative" perspective="1000px" w="full" maxW="sm" mx="auto">
      <MotionBox
        drag="x"
        dragDirectionLock
        style={{ x, rotate }}
        dragElastic={0.2}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => {
          setIsDragging(true)
          clearPressTimer()
        }}
        onDragEnd={(_, info) => {
          setIsDragging(false)
          const { offset, velocity } = info
          const travel = offset.x + velocity.x * 0.2
          if (travel > SWIPE_THRESHOLD) onSwipe?.('right')
          else if (travel < -SWIPE_THRESHOLD) onSwipe?.('left')
          x.set(0)
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTap={handleTap}
        bg={bg}
        borderWidth="1px"
        borderColor={border}
        borderRadius="xl"
        p={6}
        minH={{ base: '64', sm: '72' }}
        boxShadow="md"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <Stack
          spacing={4}
          align="center"
          justify="center"
          textAlign="center"
          style={{ backfaceVisibility: 'hidden', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <HStack w="full" justify="space-between">
            <IconButton
              aria-label="Toggle favorite"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
              variant="ghost"
              icon={<span>{isFavorite ? '★' : '☆'}</span>}
            />
            {item.audioUrl ? (
              <IconButton
                aria-label="Play pronunciation"
                onClick={(e) => {
                  e.stopPropagation()
                  void play(item.audioUrl!)
                }}
                variant="ghost"
                icon={<span>{isPlaying ? '🔊' : '▶'}</span>}
              />
            ) : <Box />}
          </HStack>
          <Text fontSize="4xl" fontWeight="extrabold" lineHeight={1.1}>
            {item.term}
          </Text>
          <Text color="gray.500">Tap to flip · Drag left/right to navigate · Long-press for details</Text>
        </Stack>

        {/* Back */}
        <Stack
          spacing={3}
          align="center"
          justify="center"
          textAlign="center"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          p={6}
          style={{ backfaceVisibility: 'hidden', transform: flipped ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
        >
          <Text fontSize="3xl" fontWeight="bold">{item.translation}</Text>
          {item.example ? <Text color="gray.600">“{item.example}”</Text> : null}
          {item.partOfSpeech ? (
            <Text fontSize="sm" color="gray.500">{item.partOfSpeech}</Text>
          ) : null}
          <Text color="gray.400" fontSize="sm">Tap anywhere to flip back</Text>
        </Stack>
      </MotionBox>
    </Box>
  )
}

export default memo(Flashcard)
