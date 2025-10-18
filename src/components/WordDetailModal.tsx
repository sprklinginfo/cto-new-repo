import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useAudio } from '../contexts/AudioPlayerContext'
import type { VocabularyItem } from '../types/mock'

export type WordDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  item: VocabularyItem | null
  isFavorite: boolean
  onToggleFavorite: () => void
}

const WordDetailModal = ({ isOpen, onClose, item, isFavorite, onToggleFavorite }: WordDetailModalProps) => {
  const { play, isPlaying } = useAudio()
  const badgeBg = useColorModeValue('gray.100', 'gray.700')

  if (!item) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack justify="space-between">
            <Text fontWeight="bold">{item.term}</Text>
            <HStack spacing={2}>
              {item.partOfSpeech ? (
                <Badge bg={badgeBg} textTransform="none">
                  {item.partOfSpeech}
                </Badge>
              ) : null}
              <IconButton
                aria-label="Toggle favorite"
                onClick={onToggleFavorite}
                variant="ghost"
                size="sm"
                icon={<span>{isFavorite ? '★' : '☆'}</span>}
              />
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <Box>
              <Text color="gray.600">Translation</Text>
              <Text fontWeight="semibold">{item.translation}</Text>
            </Box>
            {item.example ? (
              <Box>
                <Text color="gray.600">Example</Text>
                <Text>“{item.example}”</Text>
              </Box>
            ) : null}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack w="full" justify="space-between">
            <Button variant="outline" onClick={onToggleFavorite} colorScheme="brand">
              {isFavorite ? 'Remove favorite' : 'Add to favorites'}
            </Button>
            {item.audioUrl ? (
              <Button onClick={() => play(item.audioUrl!)} colorScheme="brand">
                {isPlaying ? 'Playing…' : 'Play audio'}
              </Button>
            ) : null}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default WordDetailModal
