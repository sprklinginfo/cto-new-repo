import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChakraProvider } from '@chakra-ui/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import theme from '../theme'
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext'
import { SessionProvider } from '../contexts/SessionContext'

const renderApp = (initialRoute = '/learn') => {
  return render(
    <ChakraProvider theme={theme}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <SessionProvider>
          <AudioPlayerProvider>
            <App />
          </AudioPlayerProvider>
        </SessionProvider>
      </MemoryRouter>
    </ChakraProvider>,
  )
}

describe('App shell and routing', () => {
  it('renders Learn page by default', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: /word lab/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /practice/i })).toBeInTheDocument()
  })

  it('navigates to Practice via bottom nav', async () => {
    renderApp('/learn')
    await userEvent.click(screen.getByRole('link', { name: /practice/i }))
    expect(screen.getByRole('heading', { name: /practice arena/i })).toBeInTheDocument()
  })
})
