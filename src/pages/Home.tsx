import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import FeatureCard from '../components/FeatureCard'
import { useFeatureList } from '../hooks/useFeatureList'

const Home = () => {
  const featureList = useFeatureList()

  return (
    <Box bgGradient="linear(to-br, brand.50, white)" minHeight="100vh">
      <Container maxW="5xl" py={{ base: 12, md: 20 }}>
        <Stack spacing={{ base: 10, md: 16 }}>
          <Stack
            spacing={6}
            align={{ base: 'flex-start', md: 'center' }}
            textAlign={{ base: 'left', md: 'center' }}
          >
            <Badge colorScheme="brand" borderRadius="full" px={4} py={1} fontSize="sm">
              Mobile-first English learning
            </Badge>
            <Heading size="2xl" maxW="3xl">
              Learn the right words, practice with purpose, and track your progress anywhere.
            </Heading>
            <Text color="gray.600" maxW="2xl">
              LingoLearn brings together vocabulary drills, quick practice sessions, and progress insights so
              you can grow confident in English without breaking your daily routine.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button colorScheme="brand" size="lg">
                Start a lesson
              </Button>
              <Button size="lg" variant="outline" colorScheme="brand">
                Browse the roadmap
              </Button>
            </Stack>
          </Stack>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
            {featureList.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  )
}

export default Home
