import { Box, HStack, Link, Text } from '@chakra-ui/react'
import { NavLink, useLocation } from 'react-router-dom'

const BottomNav = () => {
  const location = useLocation()

  const links = [
    { to: '/learn', label: 'Learn' },
    { to: '/practice', label: 'Practice' },
    { to: '/progress', label: 'Progress' },
  ]

  return (
    <Box
      as="nav"
      display={{ base: 'block', md: 'none' }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTopWidth="1px"
      py={2}
      pb={`max(0.5rem, env(safe-area-inset-bottom))`}
      zIndex={10}
   >
      <HStack justify="space-around">
        {links.map((l) => {
          const isActive = location.pathname === l.to
          return (
            <Link
              key={l.to}
              as={NavLink}
              to={l.to}
              _hover={{ textDecoration: 'none' }}
            >
              <Text fontWeight={isActive ? '700' : '500'} color={isActive ? 'brand.600' : 'gray.600'}>
                {l.label}
              </Text>
            </Link>
          )
        })}
      </HStack>
    </Box>
  )
}

export default BottomNav
