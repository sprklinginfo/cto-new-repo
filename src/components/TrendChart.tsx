import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'

export type TrendDatum = { label: string; value: number }

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

type Props = {
  data: TrendDatum[]
  height?: number
  color?: string
  ariaLabel?: string
}

const TrendChart = ({ data, height = 160, color, ariaLabel }: Props) => {
  const barColor = color ?? useColorModeValue('#1e79e6', '#62abff')
  const gridColor = useColorModeValue('#e2e8f0', '#2d3748')

  const max = Math.max(1, ...data.map((d) => d.value))
  const padding = 8
  const barWidth = 14
  const gap = 8
  const innerWidth = data.length * barWidth + (data.length - 1) * gap
  const width = innerWidth + padding * 2
  const innerHeight = height - padding * 2

  const y = (v: number) => innerHeight - (v / max) * innerHeight

  return (
    <Box role="img" aria-label={ariaLabel ?? 'Trend chart'}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
        {/* grid lines */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={padding}
            x2={width - padding}
            y1={padding + innerHeight * p}
            y2={padding + innerHeight * p}
            stroke={gridColor}
            strokeWidth={1}
            strokeDasharray="3,3"
          />
        ))}
        {data.map((d, i) => {
          const h = clamp((d.value / max) * innerHeight, 0, innerHeight)
          const x = padding + i * (barWidth + gap)
          const rectY = padding + innerHeight - h
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={rectY}
                width={barWidth}
                height={h}
                rx={4}
                fill={barColor}
              />
            </g>
          )
        })}
      </svg>
      <Flex justify="space-between" mt={2} aria-hidden>
        {data.map((d, i) => (
          <Text key={`${d.label}-${i}`} fontSize="xs" color="gray.500">
            {d.label}
          </Text>
        ))}
      </Flex>
    </Box>
  )
}

export default TrendChart
