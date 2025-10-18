import { Box, Container } from '@chakra-ui/react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box minH="100vh" bg={{ base: 'white', md: 'gray.50' }} pb={{ base: 16, md: 0 }}>
      <Header />
      <Container maxW="container.md" px={4} py={4}>
        {children}
      </Container>
      <BottomNav />
    </Box>
  )
}

export default AppLayout
