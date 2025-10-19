import { useCallback, useMemo, useRef, useState } from 'react'
import { Box, HStack, Spinner, Text } from '@chakra-ui/react'

export type PullToRefreshProps = {
  onRefresh: () => Promise<void> | void
  threshold?: number
  children: React.ReactNode
  height?: number | string
  'data-testid'?: string
}

// Lightweight pull-to-refresh wrapper for scrollable content (mobile-friendly)
// Works best when the content starts scrolled at the very top.
const PullToRefresh = ({ onRefresh, threshold = 60, children, height, 'data-testid': dataTestId }: PullToRefreshProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startYRef = useRef<number | null>(null)
  const draggingRef = useRef(false)

  const canStartPull = useCallback(() => {
    const el = containerRef.current
    if (!el) return false
    return el.scrollTop <= 0 && !refreshing
  }, [refreshing])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!canStartPull()) return
    startYRef.current = e.clientY
    draggingRef.current = true
  }, [canStartPull])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const startY = startYRef.current
    if (startY == null) return
    const dy = e.clientY - startY
    if (dy > 0) {
      // apply easing to pull distance for nicer feel
      const eased = Math.round(dy * 0.5)
      setPull(Math.min(3 * threshold, eased))
    }
  }, [threshold])

  const doRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
      setPull(0)
    }
  }, [onRefresh])

  const onPointerUp = useCallback(() => {
    if (!draggingRef.current) return
    draggingRef.current = false
    if (pull >= threshold) void doRefresh()
    else setPull(0)
  }, [pull, threshold, doRefresh])

  const indicator = useMemo(() => {
    const ready = pull >= threshold
    return (
      <HStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={`${Math.max(pull, refreshing ? threshold : 0)}px`}
        alignItems="center"
        justifyContent="center"
        color="gray.600"
        pointerEvents="none"
      >
        {refreshing ? (
          <HStack>
            <Spinner size="sm" />
            <Text fontSize="sm">Refreshing…</Text>
          </HStack>
        ) : (
          <Text fontSize="sm">{ready ? 'Release to refresh' : 'Pull to refresh'}</Text>
        )}
      </HStack>
    )
  }, [pull, threshold, refreshing])

  return (
    <Box
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      position="relative"
      overflowY="auto"
      height={height}
      data-testid={dataTestId ?? 'pull-to-refresh'}
      style={{ touchAction: 'pan-y' }}
    >
      {indicator}
      <Box pt={`${refreshing ? threshold : 0}px`}>{children}</Box>
    </Box>
  )
}

export default PullToRefresh
