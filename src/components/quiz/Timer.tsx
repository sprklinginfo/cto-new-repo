import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, HStack, Progress, Text } from '@chakra-ui/react'

export type TimerProps = {
  seconds: number
  running: boolean
  onExpire?: () => void
  onTick?: (remaining: number) => void
}

const Timer = ({ seconds, running, onExpire, onTick }: TimerProps) => {
  const [remaining, setRemaining] = useState(seconds)
  const startedRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setRemaining(seconds)
    startedRef.current = null
  }, [seconds])

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return
    }
    const loop = (ts: number) => {
      if (!startedRef.current) startedRef.current = ts
      const elapsed = (ts - startedRef.current) / 1000
      const next = Math.max(0, Math.ceil(seconds - elapsed))
      if (next !== remaining) {
        setRemaining(next)
        onTick?.(next)
      }
      if (elapsed >= seconds) {
        onExpire?.()
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [running, seconds, remaining, onExpire, onTick])

  const percent = useMemo(() => (remaining / seconds) * 100, [remaining, seconds])

  return (
    <Box role="timer" aria-label="Countdown timer">
      <HStack justify="space-between" mb={1}>
        <Text fontSize="sm" color="gray.600">Time</Text>
        <Text fontSize="sm" fontWeight="bold" color={remaining <= 5 ? 'red.500' : 'gray.700'}>
          {remaining}s
        </Text>
      </HStack>
      <Progress value={percent} size="xs" colorScheme={remaining <= 5 ? 'red' : 'brand'} borderRadius="full" />
    </Box>
  )
}

export default Timer
