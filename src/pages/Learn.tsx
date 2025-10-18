import { Box, Heading, Select, Skeleton, Stack, Text } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { useSeedMockData, useVocabularySets } from '../hooks/useMockData'
import FlashcardDeck from '../components/FlashcardDeck'

const Learn = () => {
  useSeedMockData()
  const { data: sets, loading } = useVocabularySets()
  const [setId, setSetId] = useState<string>('')

  const activeSet = useMemo(() => {
    if (!sets.length) return null
    const id = setId || sets[0].id
    return sets.find((s) => s.id === id) ?? sets[0]
  }, [sets, setId])

  return (
    <Stack spacing={4}>
      <Heading size="lg">Word Lab</Heading>
      <Text color="gray.600">Master essential vocabulary with bite-sized word cards, audio, and gestures.</Text>

      <Box>
        {loading ? (
          <Skeleton height="10" borderRadius="md" />
        ) : (
          <Select
            value={activeSet?.id ?? ''}
            onChange={(e) => setSetId(e.target.value)}
            maxW="xs"
            bg="white"
            borderColor="gray.200"
          >
            {sets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} {s.level ? `· ${s.level}` : ''}
              </option>
            ))}
          </Select>
        )}
      </Box>

      {loading ? (
        <Stack spacing={3}>
          <Skeleton height="40" borderRadius="lg" />
          <Skeleton height="10" borderRadius="lg" />
        </Stack>
      ) : activeSet ? (
        <FlashcardDeck items={activeSet.items} storageKey={`ll_learn_idx_${activeSet.id}`} />
      ) : (
        <Box bg="white" borderRadius="lg" borderWidth="1px" p={6} textAlign="center">
          No vocabulary sets available
        </Box>
      )}
    </Stack>
  )
}

export default Learn
