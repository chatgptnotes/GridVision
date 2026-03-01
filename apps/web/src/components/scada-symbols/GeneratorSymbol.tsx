import React from 'react';

interface GeneratorSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function GeneratorSymbol({
  width = 60,
  height = 70,
  state = 'RUNNING',
  color,
  onClick,
  label,
}: GeneratorSymbolProps) {
  const strokeColor =
    color ||
    (state === 'RUNNING'
      ? '#16A34A'
      : state === 'STOPPED'
        ? '#9CA3AF'
        : '#DC2626');

  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'STOPPED' ? '#9CA3AF' : '#1E293B';

  // Center of the circle
  const cx = 30;
  const cy = 30;
  const r = 22;

  // Sine wave path inside the circle (small waveform indicating generation)
  const sineWavePath = [
    'M', cx - 14, cy,
    'Q', cx - 10, cy - 8, cx - 6, cy,
    'Q', cx - 2, cy + 8, cx + 2, cy,
    'Q', cx + 6, cy - 8, cx + 10, cy,
    'Q', cx + 14, cy + 8, cx + 14, cy,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Generator (${state})`}
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-gen {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .gen-fault-flash {
              animation: fault-flash-gen 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={cy - r}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Main generator circle */}
      <circle
        className={state === 'FAULT' ? 'gen-fault-flash' : undefined}
        cx={cx}
        cy={cy}
        r={r}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fillNone}
      />

      {/* "G" letter */}
      <text
        x={cx}
        y={cy - 7}
        fontSize={14}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={strokeColor}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        G
      </text>

      {/* Sine wave symbol inside circle */}
      <path
        d={sineWavePath}
        stroke={strokeColor}
        strokeWidth={1.5}
        fill={fillNone}
        opacity={state === 'RUNNING' ? 1 : 0.3}
      />

      {/* Bottom connection line */}
      <line
        x1={cx}
        y1={cy + r}
        x2={cx}
        y2={58}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Label text */}
      {label && (
        <text
          x={cx}
          y={67}
          fontSize={9}
          fontFamily="Arial, sans-serif"
          fontWeight="500"
          fill={labelColor}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
