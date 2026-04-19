import { useState, useMemo } from 'react'
import csvRaw from '../_data/j80.csv?raw'
import { cn } from '@/lib/utils'

interface Props {
  lang?: 'en' | 'es'
}

export default function PolarChart({ lang = 'es' }: Props) {
  
  const t = {
    es: {
      maxSpeed: 'Vel. Máxima',
      run: 'Popa',
      kn: 'kn'
    },
    en: {
      maxSpeed: 'Max Speed',
      run: 'Run',
      kn: 'kn'
    }
  }
  const currentT = t[lang]

  const dataPoints = useMemo(() => {
    const lines = csvRaw.trim().split('\n')
    const twsValues = lines[0].split(';').slice(1).map(Number)
    const data = twsValues.map((tws) => ({
      tws,
      points: [] as { twa: number; speed: number }[],
      maxSpeedPoint: { twa: 0, speed: 0 },
      runPoint: { twa: 0, speed: 0 },
    }))

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(';').map(Number)
      const twa = parts[0]
      for (let j = 0; j < twsValues.length; j++) {
        if (twa !== 0 && parts[j + 1] > 0) {
          data[j].points.push({ twa, speed: parts[j + 1] })
        }
      }
    }

    data.forEach((d) => {
      d.points.sort((a, b) => a.twa - b.twa)

      let maxSpeedPoint = d.points[0]
      for (const p of d.points) {
        if (p.speed > maxSpeedPoint.speed) maxSpeedPoint = p
      }
      d.maxSpeedPoint = maxSpeedPoint

      let maxVmgDown = -100
      let runPoint = d.points[0]
      for (const p of d.points) {
        if (p.twa >= 90) {
          const vmg = p.speed * Math.cos((180 - p.twa) * (Math.PI / 180))
          if (vmg > maxVmgDown) {
            maxVmgDown = vmg
            runPoint = p
          }
        }
      }
      d.runPoint = runPoint
    })

    return data
  }, [])

  const [hoveredTws, setHoveredTws] = useState<number | null>(null)

  const width = 600
  const height = 600
  const cx = width / 2
  const cy = height / 2
  const maxRadius = 240
  const maxSpeed = 25

  const rScale = (speed: number) => (speed / maxSpeed) * maxRadius

  // Generate path string for a TWS curve
  const generatePath = (
    points: { twa: number; speed: number }[],
    mirror = false,
  ) => {
    const sign = mirror ? -1 : 1
    const coords = points.map((p) => {
      const rad = (p.twa * sign - 90) * (Math.PI / 180)
      const r = rScale(p.speed)
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
      }
    })

    return coords
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`)
      .join(' ')
  }

  // Grid lines
  const gridSpeeds = [5, 10, 15, 20, 25]
  const gridAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

  const colors = [
    '#3b82f6', // blue-500
    '#0ea5e9', // sky-500
    '#06b6d4', // cyan-500
    '#14b8a6', // teal-500
    '#10b981', // emerald-500
    '#84cc16', // lime-500
    '#eab308', // yellow-500
    '#f97316', // orange-500
    '#ef4444', // red-500
  ]

  return (
    <div className="mx-auto my-8 flex w-full max-w-2xl flex-col items-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="text-foreground h-auto w-full font-sans"
      >
        {/* Draw grid circles */}
        {gridSpeeds.map((speed) => (
          <circle
            key={`circle-${speed}`}
            cx={cx}
            cy={cy}
            r={rScale(speed)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
        ))}

        {/* Draw grid labels */}
        {gridSpeeds.map((speed) => (
          <text
            key={`label-${speed}`}
            x={cx}
            y={cy - rScale(speed) - 5}
            textAnchor="middle"
            fill="currentColor"
            fillOpacity={0.5}
            fontSize={12}
          >
            {speed}
          </text>
        ))}

        {/* Draw angle lines */}
        {gridAngles.map((angle) => {
          const rad = (angle - 90) * (Math.PI / 180)
          const x2 = cx + maxRadius * Math.cos(rad)
          const y2 = cy + maxRadius * Math.sin(rad)
          return (
            <g key={`angle-${angle}`}>
              <line
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeOpacity={0.15}
                strokeWidth={1}
              />
              <text
                x={cx + (maxRadius + 20) * Math.cos(rad)}
                y={cy + (maxRadius + 20) * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fillOpacity={0.7}
                fontSize={12}
              >
                {angle > 180 ? 360 - angle : angle}°
              </text>
            </g>
          )
        })}

        {/* Draw polar lines */}
        {dataPoints.map(({ tws, points, maxSpeedPoint, runPoint }, index) => {
          const isHovered = hoveredTws === tws
          const isFaded = hoveredTws !== null && hoveredTws !== tws
          const color = colors[index % colors.length]

          return (
            <g
              key={`path-${tws}`}
              onMouseEnter={() => setHoveredTws(tws)}
              onMouseLeave={() => setHoveredTws(null)}
              className="cursor-pointer transition-opacity duration-200"
              style={{ opacity: isFaded ? 0.2 : 1 }}
            >
              {isHovered && (
                <>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={
                      cx +
                      rScale(maxSpeedPoint.speed) *
                        Math.cos(((maxSpeedPoint.twa - 90) * Math.PI) / 180)
                    }
                    y2={
                      cy +
                      rScale(maxSpeedPoint.speed) *
                        Math.sin(((maxSpeedPoint.twa - 90) * Math.PI) / 180)
                    }
                    stroke={color}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    opacity={0.8}
                  />
                  <circle
                    cx={
                      cx +
                      rScale(maxSpeedPoint.speed) *
                        Math.cos(((maxSpeedPoint.twa - 90) * Math.PI) / 180)
                    }
                    cy={
                      cy +
                      rScale(maxSpeedPoint.speed) *
                        Math.sin(((maxSpeedPoint.twa - 90) * Math.PI) / 180)
                    }
                    r={5}
                    fill={color}
                  />
                  <text
                    x={
                      cx +
                      (rScale(maxSpeedPoint.speed) + 15) *
                        Math.cos(((maxSpeedPoint.twa - 90) * Math.PI) / 180)
                    }
                    y={
                      cy +
                      (rScale(maxSpeedPoint.speed) + 15) *
                        Math.sin(((maxSpeedPoint.twa - 90) * Math.PI) / 180)
                    }
                    fill={color}
                    fontSize={12}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >{currentT.maxSpeed}</text>

                  <line
                    x1={cx}
                    y1={cy}
                    x2={
                      cx +
                      rScale(runPoint.speed) *
                        Math.cos(((runPoint.twa - 90) * Math.PI) / 180)
                    }
                    y2={
                      cy +
                      rScale(runPoint.speed) *
                        Math.sin(((runPoint.twa - 90) * Math.PI) / 180)
                    }
                    stroke={color}
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    opacity={0.8}
                  />
                  <circle
                    cx={
                      cx +
                      rScale(runPoint.speed) *
                        Math.cos(((runPoint.twa - 90) * Math.PI) / 180)
                    }
                    cy={
                      cy +
                      rScale(runPoint.speed) *
                        Math.sin(((runPoint.twa - 90) * Math.PI) / 180)
                    }
                    r={5}
                    fill={color}
                  />
                  <text
                    x={
                      cx +
                      (rScale(runPoint.speed) + 15) *
                        Math.cos(((runPoint.twa - 90) * Math.PI) / 180)
                    }
                    y={
                      cy +
                      (rScale(runPoint.speed) + 15) *
                        Math.sin(((runPoint.twa - 90) * Math.PI) / 180)
                    }
                    fill={color}
                    fontSize={12}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >{currentT.run}</text>
                </>
              )}
              {/* Right side */}
              <path
                d={generatePath(points, false)}
                fill="none"
                stroke={color}
                strokeWidth={isHovered ? 3 : 2}
              />
              {/* Left side (mirrored) */}
              <path
                d={generatePath(points, true)}
                fill="none"
                stroke={color}
                strokeWidth={isHovered ? 3 : 2}
              />
              {/* Invisible thicker paths for easier hover */}
              <path
                d={generatePath(points, false)}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
              />
              <path
                d={generatePath(points, true)}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
              />
            </g>
          )
        })}
      </svg>

      {/* Legend / Info */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium">
        {dataPoints.map(({ tws }, index) => {
          const color = colors[index % colors.length]
          const isHovered = hoveredTws === tws
          const isFaded = hoveredTws !== null && hoveredTws !== tws

          return (
            <div
              key={`legend-${tws}`}
              className={cn(
                'cursor-pointer rounded-full border border-transparent px-3 py-1.5 transition-all duration-200',
              )}
              style={{
                backgroundColor: isHovered ? color : `${color}1A`, // 10% opacity for background
                color: isHovered ? '#fff' : color,
                borderColor: isHovered ? color : 'transparent',
                opacity: isFaded ? 0.4 : 1,
              }}
              onMouseEnter={() => setHoveredTws(tws)}
              onMouseLeave={() => setHoveredTws(null)}
            >
              {tws} {currentT.kn}
            </div>
          )
        })}
      </div>
    </div>
  )
}
