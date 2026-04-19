import { useState, useEffect } from 'react'

interface Props {
  lang?: 'en' | 'es'
}

export default function WaveFront({ lang = 'es' }: Props) {
  const [speed, setSpeed] = useState(0) // 0 to 100
  const [time, setTime] = useState(0)

  useEffect(() => {
    let animationFrameId: number

    const animate = (now: number) => {
      setTime(now / 1000)
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  const t = {
    es: {
      controls: { speed: 'Velocidad:' },
      stages: {
        slow: 'Baja velocidad: El barco apenas genera olas. La resistencia es mínima y navega plano.',
        medium:
          'Velocidad media: La ola de proa se alarga. La popa empieza a hundirse en el valle de la ola.',
        hullSpeed:
          'Velocidad de casco: La longitud de la ola iguala la eslora del barco. Atrapado entre dos crestas, la resistencia crece drásticamente.',
        overSpeed:
          'Superando la velocidad de casco: La ola es más larga que el barco. La popa cae en el valle, obligando al velero a navegar "cuesta arriba".',
      },
    },
    en: {
      controls: { speed: 'Speed:' },
      stages: {
        slow: 'Low speed: The boat barely generates waves. Drag is minimal and it sails flat.',
        medium:
          'Medium speed: The bow wave lengthens. The stern starts to settle into the wave trough.',
        hullSpeed:
          'Hull speed: The wave length equals the boat length. Trapped between two crests, drag increases drastically.',
        overSpeed:
          'Exceeding hull speed: The wave is longer than the boat. The stern falls into the trough, forcing the boat to sail "uphill".',
      },
    },
  }

  const currentT = t[lang]

  // Math for wave and boat
  let wavelength = 40
  if (speed <= 75) {
    wavelength = 50 + (speed / 75) * 110 // 50 to 160
  } else {
    wavelength = 160 + ((speed - 75) / 25) * 160 // 160 to 320
  }

  const amplitude = (speed / 100) * 25 // 0 to 25

  const getWaveY = (x: number) => {
    // Main bow wave (stationary relative to boat, represents the wake)
    // Offset the cosine so that x=80 (bow) is roughly a crest, but x=-80 (stern) naturally falls in the trough before hull speed
    const phaseOffset = -Math.PI / 8 // shift wave slightly right
    const bowY =
      -amplitude * Math.cos((2 * Math.PI * (x - 80)) / wavelength + phaseOffset)

    // Ambient waves moving leftwards relative to the boat.
    // They move faster when the boat moves faster.
    const ambientSpeed = 2 + speed * 0.1
    const ambientY = 2.5 * Math.sin(x * 0.05 + time * ambientSpeed)

    return bowY + ambientY
  }

  // Track the wave at the exact points where the hull crosses the local y=0 waterline (x=70 and x=-70)
  const yBow = getWaveY(70)
  const yStern = getWaveY(-70)

  const cy = (yBow + yStern) / 2
  const angleRad = Math.atan2(yBow - yStern, 140)
  // No dampening here so the waterline of the boat perfectly matches the wave slope
  const angleDeg = angleRad * (180 / Math.PI)

  let wavePath = `M -200 150 `
  for (let x = -200; x <= 200; x += 5) {
    wavePath += `L ${x} ${getWaveY(x)} `
  }
  wavePath += `L 200 150 Z`

  // Dash offset for speed lines (water flowing past)
  const dashOffset = time * (20 + speed * 3)

  // Determine stage for explanation
  let stageText = currentT.stages.slow
  if (speed > 25 && speed <= 60) stageText = currentT.stages.medium
  else if (speed > 60 && speed <= 85) stageText = currentT.stages.hullSpeed
  else if (speed > 85) stageText = currentT.stages.overSpeed

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 p-4">
      {/* Visualizer */}
      <div className="border-border relative aspect-[2/1] w-full max-w-[500px] overflow-hidden rounded-xl border bg-sky-50/50 dark:bg-sky-950/20">
        <svg
          viewBox="-150 -100 300 200"
          className="relative z-10 h-full w-full drop-shadow-sm"
          style={{ overflow: 'hidden' }}
        >
          {/* Background guide */}
          <line
            x1="-150"
            y1="0"
            x2="150"
            y2="0"
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeDasharray="4 4"
          />

          {/* Background Wave (slightly offset for depth) */}
          <path
            d={wavePath}
            className="fill-sky-400/20 dark:fill-sky-600/20"
            transform="translate(-10, -5)"
          />

          {/* Main Wave (Back layer) */}
          <path
            d={wavePath}
            className="fill-sky-500/80 stroke-sky-600 dark:fill-sky-500/60 dark:stroke-sky-400"
            strokeWidth="2"
          />

          {/* Speed lines in water */}
          <g
            className="stroke-sky-100 opacity-40 dark:stroke-sky-900"
            strokeWidth="2"
            strokeDasharray="20 40"
          >
            <line
              x1="-200"
              y1="30"
              x2="200"
              y2="30"
              strokeDashoffset={dashOffset}
            />
            <line
              x1="-200"
              y1="60"
              x2="200"
              y2="60"
              strokeDashoffset={dashOffset * 1.2}
            />
            <line
              x1="-200"
              y1="90"
              x2="200"
              y2="90"
              strokeDashoffset={dashOffset * 0.8}
            />
          </g>

          {/* Boat Group */}
          <g transform={`translate(0, ${cy}) rotate(${angleDeg})`}>
            {/* Keel (Orza) */}
            <path
              d="M -20,10 L -10,40 L 0,40 L 10,10 Z"
              className="fill-neutral-700 dark:fill-neutral-300"
            />
            {/* Hull */}
            <path
              d="M -80,-15 L 80,-30 L 70, 0 C 40,30 -40,30 -70,0 Z"
              style={{ fill: 'var(--boat-color)' }}
            />
            {/* Mast */}
            <line
              x1="-10"
              y1="-10"
              x2="-10"
              y2="-90"
              className="stroke-neutral-800 dark:stroke-neutral-200"
              strokeWidth="3"
            />
            {/* Sail */}
            <path
              d="M -10,-85 L 40,-15 L -10,-15 Z"
              style={{ fill: 'var(--sail-color)' }}
            />
          </g>

          {/* Foreground semi-transparent wave to make boat look submerged */}
          <path d={wavePath} className="fill-sky-500/30 dark:fill-sky-400/20" />
        </svg>
      </div>

      {/* Slider */}
      <div className="flex w-full max-w-sm flex-col gap-2">
        <label className="text-center text-sm font-medium">
          {currentT.controls.speed} {speed}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="accent-primary w-full"
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-muted/30 flex h-32 w-full items-center justify-center rounded-lg p-4 text-center text-sm md:h-24">
        <p>{stageText}</p>
      </div>
    </div>
  )
}
