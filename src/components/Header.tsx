import { Box, Container, Flex, HStack, IconButton, Text, useColorMode } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  const LinkItem = ({ to, label }: { to: string; label: string }) => (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Text
          as="span"
          px={2}
          py={1}
          borderRadius="md"
          fontWeight={isActive ? '700' : '500'}
          color={isActive ? 'brand.600' : 'gray.600'}
          bg={isActive ? 'brand.50' : 'transparent'}
        >
          {label}
        </Text>
      )}
    </NavLink>
  )

  return (
    <Box as="header" position="sticky" top={0} zIndex={10} bg="white" borderBottomWidth="1px">
      <Container maxW="container.md" px={4} py={3}>
        <Flex align="center" justify="space-between">
          <Text fontWeight="bold" color="brand.600">LingoLearn</Text>
          <HStack display={{ base: 'none', md: 'flex' }} spacing={1}>
            <LinkItem to="/learn" label="Learn" />
            <LinkItem to="/practice" label="Practice" />
            <LinkItem to="/progress" label="Progress" />
          </HStack>
          <IconButton
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
            icon={<span>{colorMode === 'light' ? '🌙' : '☀️'}</span>}
          />
        </Flex>
      </Container>
    </Box>
  )
}

export default Header
