import { Box, HStack, IconButton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
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

const Flashcard = ({ item, onSwipe, onLongPress, isFavorite, onToggleFavorite }: FlashcardProps) => {
  const { play, isPlaying } = useAudio()
  const [flipped, setFlipped] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const pressTimer = useRef<number | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-160, 0, 160], [-10, 0, 10])
  const bg = useColorModeValue('white', 'gray.800')
  const border = useColorModeValue('gray.100', 'gray.700')

  const clearPressTimer = () => {
    if (pressTimer.current) {
      window.clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }

  const handlePointerDown = () => {
    clearPressTimer()
    pressTimer.current = window.setTimeout(() => {
      onLongPress?.()
      pressTimer.current = null
    }, LONG_PRESS_MS)
  }

  const handlePointerUp = () => {
    clearPressTimer()
  }

  const handleTap = () => {
    if (isDragging) return
    setFlipped((f) => !f)
  }

  return (
    <Box position="relative" perspective="1000px" w="full" maxW="sm" mx="auto">
      <MotionBox
        drag="x"
        style={{ x, rotate }}
        dragElastic={0.2}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false)
          const { offset, velocity } = info
          const travel = offset.x + velocity.x * 0.2
          if (travel > SWIPE_THRESHOLD) onSwipe?.('right')
          else if (travel < -SWIPE_THRESHOLD) onSwipe?.('left')
          x.set(0)
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
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

export default Flashcard
