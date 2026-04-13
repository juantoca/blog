import { useState } from 'react'

export default function PointsOfSail() {
  const [heading, setHeading] = useState(45)

  // Points of sail definitions
  const rumbos = [
    { name: 'Aproado', angle: 0 },
    { name: 'Ceñida', angle: 45 },
    { name: 'Través', angle: 90 },
    { name: 'Largo', angle: 135 },
    { name: 'Empopada', angle: 180 },
  ]

  // Calculate sail angle (simplified: bisects angle between heading and apparent wind)
  const sailAngle =
    heading === 0 ? 0 : Math.min(90, Math.max(10, heading / 2 + 5))

  const angleOfAttack = heading - sailAngle

  // Mathematical Force Decompisition (Lift + Drag)
  // Lift acts perpendicular to sail
  const lift = 150 * Math.sin((angleOfAttack * Math.PI) / 180)
  const liftForward = lift * Math.sin((Math.abs(sailAngle) * Math.PI) / 180)
  const liftSide = lift * Math.cos((Math.abs(sailAngle) * Math.PI) / 180)

  // Drag acts parallel to wind (wind is blowing toward 180deg world)
  const drag = 60
  const dragForward = -drag * Math.cos((heading * Math.PI) / 180)
  const dragSide = drag * Math.sin((heading * Math.PI) / 180)

  const totalSide = liftSide + dragSide

  // Visual scaling
  const scale = 0.6

  // Calculate Proa (Forward) and Popa (Backward) independently so they don't cancel out visually
  let proa = 0
  let popa = 0

  if (liftForward > 0) proa += liftForward
  else popa += Math.abs(liftForward)

  if (dragForward > 0) proa += dragForward
  else popa += Math.abs(dragForward)

  const proaForce = proa * scale
  const popaForce = popa * scale
  const travesForce = totalSide * scale

  const getSailPath = (h: number, s: number) => {
    // Wind is blowing DOWN, so its world angle is 180 degrees.
    const windDir = 180
    const sailWorldAngle = h - s

    let relativeAngle = (windDir - sailWorldAngle) % 360
    if (relativeAngle < 0) relativeAngle += 360
    if (relativeAngle > 180) relativeAngle -= 360

    const maxBulge = 15
    const bulge = Math.sin((relativeAngle * Math.PI) / 180) * maxBulge

    const rightControlX = 86.25 + bulge
    const leftControlX = 82.89 + bulge

    return `M 84.57,55 C 87,55 87,60 86.5,60 Q ${rightControlX},85 86,110 L 83.14,110 Q ${leftControlX},85 82.64,60 C 82.14,60 82.14,55 84.57,55 Z`
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 p-4">
      {/* Interactive Controls */}
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {rumbos.map((rumbo) => (
          <button
            key={rumbo.name}
            onClick={() => setHeading(rumbo.angle)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              heading === rumbo.angle
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {rumbo.name}
          </button>
        ))}
      </div>

      {/* Main SVG Visualization */}
      <div className="border-border relative aspect-square w-full max-w-[400px] overflow-hidden rounded-xl border bg-blue-50/50 dark:bg-blue-950/20">
        {/* Wind lines (background) - Using the LeewayAnimation style pattern */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40">
          <defs>
            <pattern
              id="react-wind-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <g
                stroke="#3b82f6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              >
                {/* Arrows pointing DOWN */}
                <path d="M 25,25 L 25,75"></path>
                <path d="M 15,65 L 25,75 L 35,65" fill="none"></path>

                <path d="M 75,50 L 75,100"></path>
                <path d="M 65,90 L 75,100 L 85,90" fill="none"></path>
              </g>
              <animate
                attributeName="y"
                from="0"
                to="100"
                dur="1.5s"
                repeatCount="indefinite"
              ></animate>
            </pattern>
          </defs>
          <rect fill="url(#react-wind-pattern)" width="100%" height="100%" />
        </svg>

        {/* Boat and Vectors */}
        <svg
          viewBox="-150 -150 300 300"
          className="relative z-10 h-full w-full drop-shadow-md"
          style={{ overflow: 'visible' }}
        >
          <g transform={`rotate(${heading})`}>
            {/* Center the boat exactly on 0,0 based on its mast center (84.57, 55) */}
            <g transform="translate(-84.57, -55)">
              {/* Boat Hull from boat.svg */}
              <path
                id="path1"
                fill="#6e3a02"
                transform="translate(0.02627528,-0.09372976)"
                d="M 84.57,26.95 C 67.8,27.01 60.54,73.62 60.54,87.09 l -0.08,35.36 24.18,0.01 M 84.57,26.95 c 16.76,0.06 23.87,46.68 23.87,60.15 l 0.07,35.36 H 84.64"
                style={{
                  fillRule: 'evenodd',
                  strokeWidth: 0.9,
                  strokeLinecap: 'butt',
                  strokeLinejoin: 'miter',
                }}
              />
            </g>

            {/* Force Vectors - Rendered behind the sail with slight transparency */}
            <g className="opacity-80">
              {/* Vector Través (Side Force) */}
              {travesForce > 5 && (
                <g>
                  <line
                    x1="0"
                    y1="0"
                    x2={travesForce}
                    y2="0"
                    strokeWidth="4"
                    className="stroke-blue-600 dark:stroke-blue-400"
                  />
                  <polygon
                    points={`${travesForce - 2},-6 ${travesForce - 2},6 ${
                      travesForce + 8
                    },0`}
                    className="fill-blue-600 dark:fill-blue-400"
                  />
                  <g transform={`translate(${travesForce + 25}, 0)`}>
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${-heading})`}
                      className="fill-blue-600 text-[14px] font-bold dark:fill-blue-400"
                    >
                      Través
                    </text>
                  </g>
                </g>
              )}

              {/* Vector Proa (Forward Force) */}
              {proaForce > 5 && (
                <g>
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={-proaForce}
                    strokeWidth="4"
                    className="stroke-green-600 dark:stroke-green-400"
                  />
                  <polygon
                    points={`-6,${-proaForce + 2} 6,${-proaForce + 2} 0,${
                      -proaForce - 8
                    }`}
                    className="fill-green-600 dark:fill-green-400"
                  />
                  <g transform={`translate(0, ${-proaForce - 20})`}>
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${-heading})`}
                      className="fill-green-600 text-[14px] font-bold dark:fill-green-400"
                    >
                      Proa
                    </text>
                  </g>
                </g>
              )}

              {/* Vector Popa (Backward Force/Drag) */}
              {popaForce > 5 && (
                <g>
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={popaForce}
                    strokeWidth="4"
                    className="stroke-red-600 dark:stroke-red-400"
                  />
                  <polygon
                    points={`-6,${popaForce - 2} 6,${popaForce - 2} 0,${
                      popaForce + 8
                    }`}
                    className="fill-red-600 dark:fill-red-400"
                  />
                  <g transform={`translate(0, ${popaForce + 20})`}>
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${-heading})`}
                      className="fill-red-600 text-[14px] font-bold dark:fill-red-400"
                    >
                      Popa
                    </text>
                  </g>
                </g>
              )}
            </g>

            {/* Mast & Sail - Rendered on top of vectors */}
            <g transform="translate(-84.57, -55)">
              <g transform={`rotate(${-sailAngle}, 84.57, 55)`}>
                <circle
                  cx="84.57"
                  cy="55"
                  r="60"
                  fill="none"
                  pointerEvents="none"
                />
                <path
                  fill="var(--color-foreground)"
                  d={getSailPath(heading, sailAngle)}
                />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Manual Slider */}
      <div className="flex w-full max-w-sm flex-col gap-2">
        <label className="text-center text-sm font-medium">
          Ángulo respecto al viento: {heading}°
        </label>
        <input
          type="range"
          min="0"
          max="180"
          value={heading}
          onChange={(e) => setHeading(Number(e.target.value))}
          className="accent-primary w-full"
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Aproado (0°)</span>
          <span>Empopada (180°)</span>
        </div>
      </div>

      {/* Dynamic Explanation */}
      <div className="bg-muted/30 flex min-h-[80px] w-full items-center justify-center rounded-lg p-4 text-center text-sm">
        {heading < 25 && (
          <p>
            <strong>Aproado:</strong> Las velas flamean. La componente de popa
            (arrastre hacia atrás) es máxima debido al choque directo con el
            viento.
          </p>
        )}
        {heading >= 25 && heading <= 45 && (
          <p>
            <strong>Ceñida:</strong> Gran fuerza lateral (abatimiento) y la
            componente de popa aún empuja ligeramente hacia atrás. El casco
            (orza y forma) es vital para contrarrestarlo.
          </p>
        )}
        {heading > 45 && heading <= 100 && (
          <p>
            <strong>Través:</strong> El punto más rápido en la mayoría de
            barcos. Gran fuerza de proa (avance) que vence a la componente
            lateral (través).
          </p>
        )}
        {heading > 100 && heading <= 150 && (
          <p>
            <strong>Largo:</strong> Rumbo muy cómodo y rápido. La fuerza del
            viento se alinea casi enteramente con el avance del barco (proa).
          </p>
        )}
        {heading > 150 && (
          <p>
            <strong>Empopada:</strong> El viento empuja totalmente desde atrás.
            Cero fuerza de través, pero el viento aparente disminuye limitando
            la velocidad punta.
          </p>
        )}
      </div>
    </div>
  )
}
