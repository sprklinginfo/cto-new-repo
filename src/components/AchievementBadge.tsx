import { Box, HStack, Text, useColorModeValue } from '@chakra-ui/react'

type Props = {
  title: string
  description: string
  icon?: string
  unlocked: boolean
}

const AchievementBadge = ({ title, description, icon, unlocked }: Props) => {
  const border = useColorModeValue('gray.200', 'gray.700')
  const bg = useColorModeValue('white', 'gray.800')
  const dimmed = useColorModeValue('gray.400', 'gray.500')

  return (
    <Box
      role="group"
      aria-label={`${title} ${unlocked ? 'unlocked' : 'locked'}`}
      borderWidth="1px"
      borderRadius="lg"
      p={3}
      bg={bg}
      borderColor={border}
      opacity={unlocked ? 1 : 0.7}
    >
      <HStack spacing={3} align="flex-start">
        <Box fontSize="xl" aria-hidden>
          {icon ?? '🏆'}
        </Box>
        <Box>
          <Text fontWeight="semibold">{title}</Text>
          <Text fontSize="sm" color={unlocked ? 'gray.600' : dimmed}>
            {description}
          </Text>
          {!unlocked && (
            <Text mt={1} fontSize="xs" color={dimmed}>
              Locked
            </Text>
          )}
        </Box>
      </HStack>
    </Box>
  )
}

export default AchievementBadge
