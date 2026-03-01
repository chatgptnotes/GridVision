import React from 'react';

interface LevelSensorSymbolProps {
  width?: number;
  height?: number;
  state?: 'NORMAL' | 'HIGH' | 'LOW';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function LevelSensorSymbol({
  width = 40,
  height = 60,
  state = 'NORMAL',
  color,
  onClick,
  label,
  className,
  rotation,
}: LevelSensorSymbolProps) {
  const stateColor =
    color ||
    (state === 'NORMAL'
      ? '#16A34A'
      : state === 'HIGH'
        ? '#DC2626'
        : '#EAB308');

  const strokeWidth = 2;
  const cx = 20;

  // Housing dimensions
  const housingLeft = 10;
  const housingRight = 30;
  const housingTop = 4;
  const housingBottom = 20;
  const housingWidth = housingRight - housingLeft;
  const housingHeight = housingBottom - housingTop;

  // Probe dimensions
  const probeTop = housingBottom;
  const probeBottom = 50;

  // Wave level position based on state
  const waveY =
    state === 'HIGH'
      ? 28
      : state === 'NORMAL'
        ? 38
        : 46;

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
      aria-label={label || `Level Sensor (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* High state animation */}
      {state === 'HIGH' && (
        <style>
          {`
            @keyframes fault-flash-level {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .level-high-flash {
              animation: fault-flash-level 1s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g className={state === 'HIGH' ? 'level-high-flash' : undefined}>
        {/* Top connection line */}
        <line
          x1={cx}
          y1={0}
          x2={cx}
          y2={housingTop}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Top terminal dot */}
        <circle cx={cx} cy={0} r={3} fill={stateColor} />

        {/* Rectangular housing */}
        <rect
          x={housingLeft}
          y={housingTop}
          width={housingWidth}
          height={housingHeight}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          rx={2}
          ry={2}
        />

        {/* "LT" text inside housing */}
        <text
          x={cx}
          y={housingTop + housingHeight / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={stateColor}
          fontSize={8}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
        >
          LT
        </text>

        {/* Probe (vertical line extending down from housing) */}
        <line
          x1={cx}
          y1={probeTop}
          x2={cx}
          y2={probeBottom}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Probe tip */}
        <circle cx={cx} cy={probeBottom} r={2} fill={stateColor} />

        {/* Wave indicator at probe tip level */}
        <path
          d={`M ${cx - 10} ${waveY}
              Q ${cx - 6} ${waveY - 3} ${cx - 2} ${waveY}
              Q ${cx + 2} ${waveY + 3} ${cx + 6} ${waveY}
              Q ${cx + 10} ${waveY - 3} ${cx + 14} ${waveY}`}
          fill="none"
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.6}
        />

        {/* Second wave line below for depth effect */}
        <path
          d={`M ${cx - 10} ${waveY + 4}
              Q ${cx - 6} ${waveY + 1} ${cx - 2} ${waveY + 4}
              Q ${cx + 2} ${waveY + 7} ${cx + 6} ${waveY + 4}
              Q ${cx + 10} ${waveY + 1} ${cx + 14} ${waveY + 4}`}
          fill="none"
          stroke={stateColor}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.35}
        />
      </g>

      {/* Label */}
      <text
        x={cx}
        y={58}
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
