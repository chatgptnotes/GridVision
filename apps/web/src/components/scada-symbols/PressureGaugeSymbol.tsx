import React from 'react';

interface PressureGaugeSymbolProps {
  width?: number;
  height?: number;
  state?: 'NORMAL' | 'HIGH' | 'LOW';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function PressureGaugeSymbol({
  width = 50,
  height = 50,
  state = 'NORMAL',
  color,
  onClick,
  label,
  className,
  rotation,
}: PressureGaugeSymbolProps) {
  const stateColor =
    color ||
    (state === 'NORMAL'
      ? '#16A34A'
      : state === 'HIGH'
        ? '#DC2626'
        : '#EAB308');

  const strokeWidth = 2;
  const cx = 25;
  const cy = 22;
  const r = 16;

  // Needle angle based on state (from -135 to +135 degrees, where 0 is straight up)
  // LOW = -90deg (left), NORMAL = 0deg (top/center), HIGH = +90deg (right)
  const needleAngle =
    state === 'LOW'
      ? -60
      : state === 'NORMAL'
        ? 0
        : 60;

  const needleLength = r - 4;
  const needleRadians = ((needleAngle - 90) * Math.PI) / 180;
  const needleX = cx + needleLength * Math.cos(needleRadians);
  const needleY = cy + needleLength * Math.sin(needleRadians);

  // Scale arc (from -135 to +135 degrees)
  const arcStartAngle = -225;
  const arcEndAngle = 45;
  const arcR = r - 3;
  const arcStartRad = (arcStartAngle * Math.PI) / 180;
  const arcEndRad = (arcEndAngle * Math.PI) / 180;
  const arcX1 = cx + arcR * Math.cos(arcStartRad);
  const arcY1 = cy + arcR * Math.sin(arcStartRad);
  const arcX2 = cx + arcR * Math.cos(arcEndRad);
  const arcY2 = cy + arcR * Math.sin(arcEndRad);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      className={className}
      role="img"
      aria-label={label || `Pressure Gauge (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* High state flash */}
      {state === 'HIGH' && (
        <style>
          {`
            @keyframes fault-flash-pressure {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .pressure-high-flash {
              animation: fault-flash-pressure 1s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g className={state === 'HIGH' ? 'pressure-high-flash' : undefined}>
        {/* Main circle (gauge face) */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
        />

        {/* Scale arc at top */}
        <path
          d={`M ${arcX1} ${arcY1} A ${arcR} ${arcR} 0 1 1 ${arcX2} ${arcY2}`}
          fill="none"
          stroke={stateColor}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.4}
        />

        {/* Scale tick marks */}
        {[-60, -30, 0, 30, 60].map((angle, i) => {
          const tickRadians = ((angle - 90) * Math.PI) / 180;
          const outerX = cx + (r - 3) * Math.cos(tickRadians);
          const outerY = cy + (r - 3) * Math.sin(tickRadians);
          const innerX = cx + (r - 6) * Math.cos(tickRadians);
          const innerY = cy + (r - 6) * Math.sin(tickRadians);
          return (
            <line
              key={i}
              x1={innerX}
              y1={innerY}
              x2={outerX}
              y2={outerY}
              stroke={stateColor}
              strokeWidth={1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke={stateColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Needle pivot dot */}
        <circle cx={cx} cy={cy} r={2} fill={stateColor} />

        {/* "P" text */}
        <text
          x={cx}
          y={cy + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={stateColor}
          fontSize={8}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
        >
          P
        </text>

        {/* Bottom connection line */}
        <line
          x1={cx}
          y1={cy + r}
          x2={cx}
          y2={50}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Bottom terminal dot */}
        <circle cx={cx} cy={50} r={3} fill={stateColor} />
      </g>

      {/* Label */}
      <text
        x={cx + 18}
        y={46}
        textAnchor="middle"
        fill={stateColor}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || state}
      </text>
    </svg>
  );
}
