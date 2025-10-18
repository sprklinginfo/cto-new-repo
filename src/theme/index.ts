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

const breakpoints = {
  xs: '20em', // 320px
  sm: '30em', // 480px
  md: '48em', // 768px
  lg: '62em', // 992px
  xl: '80em', // 1280px
  '2xl': '96em', // 1536px
}

const fonts = {
  heading: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
}

const theme = extendTheme({
  config,
  colors,
  breakpoints,
  fonts,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        minH: '100vh',
      },
      '#root': {
        minHeight: '100vh',
      },
    },
  },
})

export default theme
