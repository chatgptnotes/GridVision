import React from 'react';

interface MotorSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function MotorSymbol({
  width = 60,
  height = 70,
  state = 'RUNNING',
  color,
  onClick,
  label,
}: MotorSymbolProps) {
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

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Motor (${state})`}
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-motor {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .motor-fault-flash {
              animation: fault-flash-motor 0.8s ease-in-out infinite;
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

      {/* Main motor circle */}
      <circle
        className={state === 'FAULT' ? 'motor-fault-flash' : undefined}
        cx={cx}
        cy={cy}
        r={r}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fillNone}
      />

      {/* "M" letter */}
      <text
        x={cx}
        y={cy + 1}
        fontSize={18}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={strokeColor}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        M
      </text>

      {/* Bottom connection line */}
      <line
        x1={cx}
        y1={cy + r}
        x2={cx}
        y2={58}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Ground/base symbol at bottom */}
      <line
        x1={cx - 8}
        y1={58}
        x2={cx + 8}
        y2={58}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <line
        x1={cx - 5}
        y1={61}
        x2={cx + 5}
        y2={61}
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      <line
        x1={cx - 2}
        y1={64}
        x2={cx + 2}
        y2={64}
        stroke={strokeColor}
        strokeWidth={1}
      />

      {/* Label text */}
      {label && (
        <text
          x={cx}
          y={69}
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
