import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react'

const Practice = () => {
  return (
    <Stack spacing={4}>
      <Heading size="lg">Practice Arena</Heading>
      <Text color="gray.600">Quick quizzes adapted to your progress.</Text>
      <Box bg="white" borderRadius="lg" borderWidth="1px" p={4}>
        <Text mb={2}>Small sample question</Text>
        <Button colorScheme="brand">Start a quick quiz</Button>
      </Box>
    </Stack>
  )
}

export default Practice
