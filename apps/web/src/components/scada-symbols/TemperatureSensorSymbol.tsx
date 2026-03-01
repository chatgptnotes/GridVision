import React from 'react';

interface TemperatureSensorSymbolProps {
  width?: number;
  height?: number;
  state?: 'NORMAL' | 'HIGH' | 'LOW';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function TemperatureSensorSymbol({
  width = 40,
  height = 60,
  state = 'NORMAL',
  color,
  onClick,
  label,
  className,
  rotation,
}: TemperatureSensorSymbolProps) {
  const stateColor =
    color ||
    (state === 'NORMAL'
      ? '#16A34A'
      : state === 'HIGH'
        ? '#DC2626'
        : '#EAB308');

  const strokeWidth = 2;
  const cx = 20;

  // Thermometer dimensions
  const bulbCy = 46;
  const bulbR = 7;
  const tubeTop = 8;
  const tubeBottom = bulbCy - bulbR + 2;
  const tubeWidth = 6;
  const tubeLeft = cx - tubeWidth / 2;
  const tubeRight = cx + tubeWidth / 2;

  // Fill level based on state (red mercury fill inside)
  const fillPercent =
    state === 'HIGH'
      ? 0.9
      : state === 'NORMAL'
        ? 0.55
        : 0.25;

  const tubeHeight = tubeBottom - tubeTop;
  const fillHeight = tubeHeight * fillPercent;
  const fillTop = tubeBottom - fillHeight;

  // Fill color (always red like mercury)
  const fillColor = '#DC2626';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 60"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      className={className}
      role="img"
      aria-label={label || `Temperature Sensor (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* High state animation */}
      {state === 'HIGH' && (
        <style>
          {`
            @keyframes fault-flash-temp {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .temp-high-flash {
              animation: fault-flash-temp 1s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g className={state === 'HIGH' ? 'temp-high-flash' : undefined}>
        {/* Tube (narrow rectangle with rounded top) */}
        <rect
          x={tubeLeft}
          y={tubeTop}
          width={tubeWidth}
          height={tubeBottom - tubeTop}
          rx={tubeWidth / 2}
          ry={tubeWidth / 2}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
        />

        {/* Mercury fill inside tube */}
        {fillPercent > 0 && (
          <rect
            x={tubeLeft + 1.5}
            y={fillTop}
            width={tubeWidth - 3}
            height={fillHeight}
            rx={1}
            fill={fillColor}
            fillOpacity={0.6}
          />
        )}

        {/* Bulb at bottom (circle) */}
        <circle
          cx={cx}
          cy={bulbCy}
          r={bulbR}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
        />

        {/* Mercury fill in bulb */}
        <circle
          cx={cx}
          cy={bulbCy}
          r={bulbR - 2}
          fill={fillColor}
          fillOpacity={0.5}
        />

        {/* Scale marks on right side of tube */}
        {[0.2, 0.4, 0.6, 0.8].map((frac, i) => {
          const markY = tubeBottom - tubeHeight * frac;
          return (
            <line
              key={i}
              x1={tubeRight + 1}
              y1={markY}
              x2={tubeRight + 4}
              y2={markY}
              stroke={stateColor}
              strokeWidth={1}
              strokeLinecap="round"
            />
          );
        })}

        {/* "T" label */}
        <text
          x={cx + 14}
          y={25}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={stateColor}
          fontSize={10}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
        >
          T
        </text>

        {/* Bottom connection line */}
        <line
          x1={cx}
          y1={bulbCy + bulbR}
          x2={cx}
          y2={60}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Bottom terminal dot */}
        <circle cx={cx} cy={60} r={3} fill={stateColor} />
      </g>

      {/* Label */}
      <text
        x={cx}
        y={5}
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
