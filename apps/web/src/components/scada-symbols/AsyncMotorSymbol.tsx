import React from 'react';

interface AsyncMotorSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function AsyncMotorSymbol({
  width = 60,
  height = 80,
  state = 'STOPPED',
  color,
  onClick,
  label,
  className,
  rotation,
}: AsyncMotorSymbolProps) {
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

  // Squirrel cage bars (short horizontal bars below the M)
  const barY = cy + 6;
  const barSpacing = 4;
  const barHalfWidth = 8;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Asynchronous Motor (${state})`}
      className={className}
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes async-motor-fault-anim {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .async-motor-fault-flash {
              animation: async-motor-fault-anim 0.8s ease-in-out infinite;
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
          className={state === 'FAULT' ? 'async-motor-fault-flash' : undefined}
          cx={cx}
          cy={cy}
          r={r}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          fill={fillNone}
          strokeLinecap="round"
        />

        {/* "M" letter */}
        <text
          x={cx}
          y={cy - 4}
          fontSize={16}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          M
        </text>

        {/* Squirrel cage indicator: short horizontal bars below M */}
        <line
          x1={cx - barHalfWidth}
          y1={barY}
          x2={cx + barHalfWidth}
          y2={barY}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={cx - barHalfWidth + 2}
          y1={barY + barSpacing}
          x2={cx + barHalfWidth - 2}
          y2={barY + barSpacing}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <line
          x1={cx - barHalfWidth + 4}
          y1={barY + barSpacing * 2}
          x2={cx + barHalfWidth - 4}
          y2={barY + barSpacing * 2}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
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
