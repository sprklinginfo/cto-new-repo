import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import theme from './theme'
import './index.css'
import { SessionProvider } from './contexts/SessionContext'
import { AudioPlayerProvider } from './contexts/AudioPlayerContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <SessionProvider>
          <AudioPlayerProvider>
            <App />
          </AudioPlayerProvider>
        </SessionProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
