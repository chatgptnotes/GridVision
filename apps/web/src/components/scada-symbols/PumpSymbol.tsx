import React from 'react';

interface PumpSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function PumpSymbol({
  width = 60,
  height = 60,
  state = 'RUNNING',
  color,
  onClick,
  label,
  className,
  rotation,
}: PumpSymbolProps) {
  const stateColor =
    color ||
    (state === 'RUNNING'
      ? '#16A34A'
      : state === 'STOPPED'
        ? '#9CA3AF'
        : '#DC2626');

  const strokeWidth = 2;
  const cx = 30;
  const cy = 32;
  const r = 14;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 60"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      className={className}
      role="img"
      aria-label={label || `Pump (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-pump {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.2; }
            }
            .pump-fault-flash {
              animation: fault-flash-pump 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g className={state === 'FAULT' ? 'pump-fault-flash' : undefined}>
        {/* Inlet connection line (left, horizontal to circle) */}
        <line
          x1={0}
          y1={cy}
          x2={cx - r}
          y2={cy}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Inlet terminal dot */}
        <circle cx={0} cy={cy} r={3} fill={stateColor} />

        {/* Outlet connection line (top, from circle tangential discharge) */}
        <line
          x1={cx + r - 2}
          y1={cy - r + 2}
          x2={55}
          y2={5}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Outlet horizontal extension */}
        <line
          x1={55}
          y1={5}
          x2={60}
          y2={5}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Outlet terminal dot */}
        <circle cx={60} cy={5} r={3} fill={stateColor} />

        {/* Main pump circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
        />

        {/* Discharge triangle (tangential arrow pointing top-right) */}
        <polygon
          points={`${cx + r - 6},${cy - r + 1} ${cx + r + 2},${cy - r - 7} ${cx + r + 2},${cy - r + 5}`}
          fill={stateColor}
          stroke={stateColor}
          strokeWidth={1}
          strokeLinejoin="round"
        />

        {/* "P" text inside */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={stateColor}
          fontSize={14}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
        >
          P
        </text>
      </g>

      {/* Label */}
      <text
        x={cx}
        y={56}
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
