import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50: '#e3f2ff',
    100: '#b8dbff',
    200: '#8dc3ff',
    300: '#62abff',
    400: '#3893ff',
    500: '#1e79e6',
    600: '#135eb4',
    700: '#084382',
    800: '#002852',
    900: '#000f24',
  },
}

const theme = extendTheme({
  config,
  colors,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
})

export default theme
