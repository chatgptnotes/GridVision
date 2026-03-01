import React from 'react';

interface SyncGeneratorSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SyncGeneratorSymbol({
  width = 70,
  height = 80,
  state = 'STOPPED',
  color,
  onClick,
  label,
  className,
  rotation,
}: SyncGeneratorSymbolProps) {
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

  // Main generator circle
  const cx = 28;
  const cy = 35;
  const r = 20;

  // Exciter circle (smaller, attached on the right)
  const exCx = 56;
  const exCy = 35;
  const exR = 10;

  // Sine wave path inside main circle when RUNNING
  const sineWavePath = [
    'M', cx - 12, cy + 8,
    'Q', cx - 7, cy, cx - 2, cy + 8,
    'Q', cx + 3, cy + 16, cx + 8, cy + 8,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Synchronous Generator (${state})`}
      className={className}
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes sync-gen-fault-anim {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .sync-gen-fault-flash {
              animation: sync-gen-fault-anim 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g transform={rotation ? `rotate(${rotation} 35 40)` : undefined}>
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

        {/* Main generator circle */}
        <circle
          className={state === 'FAULT' ? 'sync-gen-fault-flash' : undefined}
          cx={cx}
          cy={cy}
          r={r}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          fill={fillNone}
          strokeLinecap="round"
        />

        {/* "G" letter */}
        <text
          x={cx}
          y={cy - 3}
          fontSize={14}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          G
        </text>

        {/* Sine wave symbol inside circle (visible when RUNNING, faded otherwise) */}
        <path
          d={sineWavePath}
          stroke={stateColor}
          strokeWidth={1.5}
          fill={fillNone}
          strokeLinecap="round"
          opacity={state === 'RUNNING' ? 1 : 0.25}
        />

        {/* Connection line from main circle to exciter */}
        <line
          x1={cx + r}
          y1={cy}
          x2={exCx - exR}
          y2={exCy}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Exciter circle */}
        <circle
          className={state === 'FAULT' ? 'sync-gen-fault-flash' : undefined}
          cx={exCx}
          cy={exCy}
          r={exR}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          fill={fillNone}
          strokeLinecap="round"
        />

        {/* "E" letter in exciter */}
        <text
          x={exCx}
          y={exCy + 1}
          fontSize={10}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          E
        </text>

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
        x={35}
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
