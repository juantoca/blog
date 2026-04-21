import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  lang?: 'en' | 'es'
}

export default function TFoilDiagram({ lang = 'es' }: Props) {
  const [speed, setSpeed] = useState(10)

  const t = {
    en: {
      title: 'Foiling Takeoff',
      description:
        "As the boat accelerates, water flowing over the foil generates upward lift proportional to the square of the velocity. Once the lift vector exceeds the boat's constant weight, the hull rises from the water, drastically reducing drag.",
      weight: 'Weight',
      drag: 'Drag',
      velocity: 'Velocity',
      lift: 'Lift',
      boatSpeed: 'Boat Speed',
      knots: 'knots',
      takeoff: 'Takeoff (~20 kts)',
      kts0: '0 kts',
      kts50: '50 kts',
    },
    es: {
      title: 'Despegue Foil',
      description:
        'A medida que el barco acelera, el agua que fluye sobre el foil genera una sustentación hacia arriba proporcional al cuadrado de la velocidad. Una vez que el vector de sustentación supera el peso constante del barco, el casco se eleva del agua, reduciendo drásticamente la resistencia.',
      weight: 'Peso',
      drag: 'Resistencia',
      velocity: 'Velocidad',
      lift: 'Sustentación',
      boatSpeed: 'Velocidad del barco',
      knots: 'nudos',
      takeoff: 'Despegue (~20 nudos)',
      kts0: '0 nudos',
      kts50: '50 nudos',
    },
  }

  const texts = t[lang]

  // Constants
  const maxSpeed = 50
  const takeoffSpeed = 20
  const maxRideHeight = 45 // Lower max height to keep it closer to the surface

  // Scales
  const speedScale = 3.5
  const liftScale = 0.12

  const speedVectorLength = speed * speedScale
  const liftVectorLength = speed * speed * liftScale

  // Drag physics: Shows "Hump Drag" phenomenon
  // Extremely high drag at low speeds when pushing water, drastically reducing as it lifts out
  let dragVectorLength = 0
  if (speed > 0 && speed <= 8) {
    // Rapidly increasing drag as it pushes water (displacement mode)
    dragVectorLength = speed * 12 // Peaks at 96
  } else if (speed > 8 && speed < takeoffSpeed) {
    // Drag decreases as the hull begins to lift out of the water
    const progress = (speed - 8) / (takeoffSpeed - 8)
    dragVectorLength = 96 - progress * 80 // Drops to 16 at takeoff
  } else if (speed >= takeoffSpeed) {
    // Low drag while foiling, increasing slowly with air/foil friction
    dragVectorLength = 16 + Math.pow(speed - takeoffSpeed, 1.5) * 0.4
  }

  // Weight is calibrated to equal lift at exactly takeoff speed (20kts)
  const weightVectorLength = takeoffSpeed * takeoffSpeed * liftScale

  // Calculate ride height
  // At speed=0, rideHeight = -30 (hull is 30 units deep in water).
  // At takeoffSpeed, rideHeight = 0 (hull bottom skims the surface).
  let rideHeight = -30
  if (speed < takeoffSpeed) {
    const liftRatio = Math.pow(speed / takeoffSpeed, 2)
    rideHeight = -30 + 30 * liftRatio
  } else {
    const progress = (speed - takeoffSpeed) / (maxSpeed - takeoffSpeed)
    rideHeight = Math.pow(progress, 0.6) * maxRideHeight
  }

  return (
    <div className="bg-background my-8 flex flex-col items-center gap-6 rounded-xl border p-6 shadow-sm">
      <div className="text-center">
        <h3 className="mt-0 text-2xl font-bold">{texts.title}</h3>
        <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-sm">
          {texts.description}
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-lg border bg-sky-50/50 dark:bg-sky-950/10">
        <svg viewBox="0 0 800 450" className="h-full w-full">
          {/* Water Background */}
          {/* The waterline is at y=280 */}
          <rect
            x="0"
            y="280"
            width="800"
            height="170"
            className="fill-sky-400/20 dark:fill-sky-600/20"
          />
          <line
            x1="0"
            y1="280"
            x2="800"
            y2="280"
            className="stroke-sky-500/50 dark:stroke-sky-400/50"
            strokeWidth="2"
            strokeDasharray="8 4"
          />

          {/* Dynamic Boat Group */}
          <g
            transform={`translate(0, ${-rideHeight})`}
            className="transition-transform duration-300 ease-out"
          >
            {/* Hull (styled to match --boat-color used in other components) */}
            <path
              d="M 120 230 L 680 230 Q 650 280 550 280 L 150 280 Z"
              style={{ fill: 'var(--boat-color, #6e3a02)' }}
            />
            {/* Hull trim detail */}
            <path
              d="M 120 230 L 680 230 L 675 235 L 125 235 Z"
              className="fill-black/20 dark:fill-white/20"
            />

            {/* Mast */}
            <rect
              x="420"
              y="30"
              width="6"
              height="200"
              className="fill-neutral-800 dark:fill-neutral-300"
            />

            {/* Sail (styled to match --sail-color) */}
            <path
              d="M 426 35 Q 560 90 530 215 L 426 215 Z"
              style={{ fill: 'var(--sail-color, currentColor)' }}
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth="2"
            />

            {/* Main Foil Strut */}
            <rect
              x="420"
              y="280"
              width="8"
              height="130"
              className="fill-neutral-800 dark:fill-neutral-400"
            />

            {/* Main Foil Wing (Side view Airfoil) */}
            <path
              d="M 370 410 Q 424 395 470 410 Q 424 420 370 410 Z"
              className="fill-neutral-900 dark:fill-neutral-200"
            />

            {/* Rudder Strut */}
            <rect
              x="150"
              y="280"
              width="6"
              height="130"
              className="fill-neutral-800 dark:fill-neutral-400"
            />

            {/* Rudder Wing */}
            <path
              d="M 130 410 Q 153 400 170 410 Q 153 418 130 410 Z"
              className="fill-neutral-900 dark:fill-neutral-200"
            />

            {/* Weight Vector */}
            <g transform="translate(350, 255)">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={weightVectorLength}
                className="stroke-purple-500 dark:stroke-purple-400"
                strokeWidth="4"
                strokeDasharray="4 4"
                markerEnd="url(#arrowhead-weight)"
              />
              <text
                x="-12"
                y={weightVectorLength / 2}
                className="fill-purple-600 text-sm font-bold dark:fill-purple-400"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {texts.weight}
              </text>
            </g>

            {/* Drag Vector */}
            {speed > 0 && (
              <g transform="translate(670, 265)">
                <line
                  x1="0"
                  y1="0"
                  x2={-dragVectorLength}
                  y2="0"
                  className="stroke-orange-500 dark:stroke-orange-400"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead-drag)"
                />
                <text
                  x={-dragVectorLength / 2 - 5}
                  y="-12"
                  className="fill-orange-600 text-sm font-bold drop-shadow-md dark:fill-orange-400"
                  textAnchor="middle"
                >
                  {texts.drag}
                </text>
              </g>
            )}

            {/* Speed Vector */}
            {speed > 0 && (
              <g transform="translate(428, 410)">
                <line
                  x1="0"
                  y1="0"
                  x2={speedVectorLength}
                  y2="0"
                  className="stroke-red-500 dark:stroke-red-400"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead-speed)"
                />
                <text
                  x={speedVectorLength / 2}
                  y="20"
                  className="fill-red-600 text-sm font-bold drop-shadow-md dark:fill-red-400"
                  textAnchor="middle"
                >
                  {texts.velocity}
                </text>
              </g>
            )}

            {/* Lift Vector */}
            {speed > 0 && (
              <g transform="translate(424, 410)">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={-liftVectorLength}
                  className="stroke-emerald-500 dark:stroke-emerald-400"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead-lift)"
                />
                <text
                  x="12"
                  y={-liftVectorLength / 2}
                  className="fill-emerald-600 text-sm font-bold drop-shadow-md dark:fill-emerald-400"
                  textAnchor="start"
                  alignmentBaseline="middle"
                >
                  {texts.lift}
                </text>
              </g>
            )}
          </g>

          {/* Foreground Water (Overlaps the hull when submerged) */}
          <rect
            x="0"
            y="280"
            width="800"
            height="170"
            className="pointer-events-none fill-sky-400/40 dark:fill-sky-500/20"
          />

          {/* Arrowhead Definitions */}
          <defs>
            <marker
              id="arrowhead-speed"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                className="fill-red-500 dark:fill-red-400"
              />
            </marker>
            <marker
              id="arrowhead-lift"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                className="fill-emerald-500 dark:fill-emerald-400"
              />
            </marker>
            <marker
              id="arrowhead-weight"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                className="fill-purple-500 dark:fill-purple-400"
              />
            </marker>
            <marker
              id="arrowhead-drag"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                className="fill-orange-500 dark:fill-orange-400"
              />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Controls */}
      <div className="mt-2 flex w-full max-w-md flex-col gap-4">
        <div className="space-y-3">
          <div className="flex justify-between font-medium">
            <span className="text-sm font-semibold">{texts.boatSpeed}</span>
            <span
              className={cn(
                'rounded border px-2 py-0.5 font-mono text-sm shadow-sm transition-colors duration-300',
                speed >= takeoffSpeed
                  ? 'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {speed} {texts.knots}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxSpeed}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-secondary accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg"
          />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{texts.kts0}</span>
            <span
              className={cn(
                'transition-colors duration-300',
                speed >= takeoffSpeed &&
                  'font-bold text-emerald-600 dark:text-emerald-400',
              )}
            >
              {texts.takeoff}
            </span>
            <span>{texts.kts50}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
