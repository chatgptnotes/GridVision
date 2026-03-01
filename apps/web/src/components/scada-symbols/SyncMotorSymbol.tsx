import React from 'react';

interface SyncMotorSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SyncMotorSymbol({
  width = 60,
  height = 80,
  state = 'STOPPED',
  color,
  onClick,
  label,
  className,
  rotation,
}: SyncMotorSymbolProps) {
  const stateColor =
    color ||
    (state === 'RUNNING'
      ? '#16A34A'
      : state === 'FAULT'
        ? '#DC2626'
        : '#9CA3AF');

  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'STOPPED' ? '#9CA3AF' : '#1E293B';

  // Center of the circle
  const cx = 30;
  const cy = 35;
  const r = 22;

  // Sine wave path inside circle (below SM text)
  const sineWavePath = [
    'M', cx - 12, cy + 8,
    'Q', cx - 7, cy + 2, cx - 2, cy + 8,
    'Q', cx + 3, cy + 14, cx + 8, cy + 8,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Synchronous Motor (${state})`}
      className={className}
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes sync-motor-fault-anim {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .sync-motor-fault-flash {
              animation: sync-motor-fault-anim 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g transform={rotation ? `rotate(${rotation} 30 40)` : undefined}>
        {/* Top connection line */}
        <line
          x1={cx}
          y1={0}
          x2={cx}
          y2={cy - r}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Top terminal dot */}
        <circle cx={cx} cy={0} r={3} fill={stateColor} />

        {/* Main motor circle */}
        <circle
          className={state === 'FAULT' ? 'sync-motor-fault-flash' : undefined}
          cx={cx}
          cy={cy}
          r={r}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          fill={fillNone}
          strokeLinecap="round"
        />

        {/* "SM" text */}
        <text
          x={cx}
          y={cy - 4}
          fontSize={13}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          SM
        </text>

        {/* Sine wave indicator (visible when RUNNING, faded otherwise) */}
        <path
          d={sineWavePath}
          stroke={stateColor}
          strokeWidth={1.5}
          fill={fillNone}
          strokeLinecap="round"
          opacity={state === 'RUNNING' ? 1 : 0.25}
        />

        {/* Bottom connection line */}
        <line
          x1={cx}
          y1={cy + r}
          x2={cx}
          y2={65}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Bottom terminal dot */}
        <circle cx={cx} cy={65} r={3} fill={stateColor} />
      </g>

      {/* Label text */}
      <text
        x={cx}
        y={76}
        fontSize={9}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
        fill={labelColor}
        textAnchor="middle"
      >
        {label || state}
      </text>
    </svg>
  );
}
