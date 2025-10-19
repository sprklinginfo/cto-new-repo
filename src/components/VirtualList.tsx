import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'

export type VirtualListProps<T> = {
  items: T[]
  height: number
  itemHeight: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor?: (item: T, index: number) => string
  'data-testid'?: string
}

// A tiny, dependency-free vertical virtual list (windowing) for uniform-height rows
const VirtualListInner = <T,>({
  items,
  height,
  itemHeight,
  overscan = 4,
  renderItem,
  keyExtractor,
  'data-testid': dataTestId,
}: VirtualListProps<T>) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollTop, setScrollTop] = useState(0)

  const onScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    setScrollTop(el.scrollTop)
  }, [])

  const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight])
  const startIndex = useMemo(() => Math.max(0, Math.floor(scrollTop / itemHeight)), [scrollTop, itemHeight])
  const endIndex = useMemo(() => {
    const visibleCount = Math.ceil(height / itemHeight)
    return Math.min(items.length - 1, startIndex + visibleCount + overscan)
  }, [height, itemHeight, items.length, overscan, startIndex])

  const offsetY = useMemo(() => startIndex * itemHeight, [startIndex, itemHeight])
  const visibleItems = useMemo(() => items.slice(startIndex, endIndex + 1), [items, startIndex, endIndex])

  return (
    <Box
      ref={containerRef}
      onScroll={onScroll}
      height={height}
      overflowY="auto"
      position="relative"
      data-testid={dataTestId ?? 'virtual-list'}
    >
      <Box height={totalHeight} position="relative">
        <Box position="absolute" top={0} left={0} right={0} style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, i) => {
            const index = startIndex + i
            const key = keyExtractor ? keyExtractor(item, index) : `${index}`
            return (
              <Box key={key} height={itemHeight} overflow="hidden">
                {renderItem(item, index)}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

const VirtualList = memo(VirtualListInner) as typeof VirtualListInner

export default VirtualList
