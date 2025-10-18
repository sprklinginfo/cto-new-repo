import { Box, Heading, SimpleGrid, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'

const Progress = () => {
  return (
    <Box>
      <Heading size="lg" mb={4}>Progress Pulse</Heading>
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        <Stat bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <StatLabel>Streak</StatLabel>
          <StatNumber>5 days</StatNumber>
          <StatHelpText>Keep it going</StatHelpText>
        </Stat>
        <Stat bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <StatLabel>Words learned</StatLabel>
          <StatNumber>120</StatNumber>
          <StatHelpText>Last 30 days</StatHelpText>
        </Stat>
        <Stat bg="white" borderWidth="1px" borderRadius="lg" p={4}>
          <StatLabel>Weekly goal</StatLabel>
          <StatNumber>80%</StatNumber>
          <StatHelpText>16/20 lessons</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  )
}

export default Progress
