import { ChakraProvider } from '@chakra-ui/react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import PullToRefresh from '../components/PullToRefresh'
import theme from '../theme'

const renderWithChakra = (ui: React.ReactElement) => render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>)

describe('PullToRefresh', () => {
  it('triggers onRefresh after sufficient pull', async () => {
    const onRefresh = vi.fn()
    renderWithChakra(
      <PullToRefresh onRefresh={onRefresh} height={200} data-testid="ptr">
        <div style={{ height: 800 }}>Scrollable content</div>
      </PullToRefresh>,
    )

    const container = screen.getByTestId('ptr') as HTMLDivElement

    // Ensure we are at top
    Object.defineProperty(container, 'scrollTop', { value: 0, writable: true })

    // Simulate pull gesture
    fireEvent.pointerDown(container, { clientY: 0 })
    fireEvent.pointerMove(container, { clientY: 140 }) // pull > threshold (60)
    fireEvent.pointerUp(container)

    // Indicator should switch to refreshing and onRefresh called
    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(within(container).getByText(/refresh/i)).toBeInTheDocument()
  })
})
