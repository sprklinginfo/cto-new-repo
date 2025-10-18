import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { useAudio } from '../contexts/AudioPlayerContext'

const Learn = () => {
  const { play, isPlaying } = useAudio()

  return (
    <Stack spacing={4}>
      <Heading size="lg">Word Lab</Heading>
      <Text color="gray.600">Master essential vocabulary with bite-sized word cards and audio.</Text>
      <Box bg="white" borderRadius="lg" borderWidth="1px" p={4}>
        <Text mb={2}>Example word: hello</Text>
        <Button
          onClick={() => play('https://upload.wikimedia.org/wikipedia/commons/c/c8/En-us-hello.ogg')}
          colorScheme="brand"
        >
          {isPlaying ? 'Playing...' : 'Play pronunciation'}
        </Button>
      </Box>
    </Stack>
  )
}

export default Learn
