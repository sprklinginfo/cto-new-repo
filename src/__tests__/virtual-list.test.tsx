import { ChakraProvider } from '@chakra-ui/react'
import { render, screen, within, fireEvent } from '@testing-library/react'
import VirtualList from '../components/VirtualList'
import theme from '../theme'

const renderWithChakra = (ui: React.ReactElement) => render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>)

describe('VirtualList', () => {
  it('renders only a window of items', () => {
    const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`)
    renderWithChakra(
      <VirtualList
        items={items}
        height={300}
        itemHeight={30}
        renderItem={(t) => <div>{t}</div>}
        keyExtractor={(t) => t}
        data-testid="vl"
      />,
    )

    const container = screen.getByTestId('vl')
    // viewport shows 10 + overscan 4 => <= 20
    const rendered = within(container).queryAllByText(/Item /)
    expect(rendered.length).toBeLessThan(25)
  })

  it('updates visible items on scroll', () => {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)
    renderWithChakra(
      <VirtualList
        items={items}
        height={200}
        itemHeight={20}
        renderItem={(t) => <div>{t}</div>}
        keyExtractor={(t) => t}
        data-testid="vl"
      />,
    )

    const container = screen.getByTestId('vl')
    // initially the first item should be in view
    expect(within(container).getByText('Item 1')).toBeInTheDocument()

    // scroll down by 200 -> should move ~10 items
    Object.defineProperty(container, 'scrollTop', { value: 200, writable: true })
    fireEvent.scroll(container)

    expect(within(container).queryByText('Item 1')).not.toBeInTheDocument()
    expect(within(container).getByText('Item 10')).toBeInTheDocument()
  })
})
