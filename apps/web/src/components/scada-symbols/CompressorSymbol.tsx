import React from 'react';

interface CompressorSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function CompressorSymbol({
  width = 60,
  height = 60,
  state = 'RUNNING',
  color,
  onClick,
  label,
  className,
  rotation,
}: CompressorSymbolProps) {
  const stateColor =
    color ||
    (state === 'RUNNING'
      ? '#16A34A'
      : state === 'STOPPED'
        ? '#9CA3AF'
        : '#DC2626');

  const strokeWidth = 2;
  const cx = 30;
  const cy = 30;
  const r = 18;

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
      aria-label={label || `Compressor (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-compressor {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.2; }
            }
            .compressor-fault-flash {
              animation: fault-flash-compressor 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g className={state === 'FAULT' ? 'compressor-fault-flash' : undefined}>
        {/* Left connection line */}
        <line
          x1={0}
          y1={cy}
          x2={cx - r}
          y2={cy}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Left terminal dot */}
        <circle cx={0} cy={cy} r={3} fill={stateColor} />

        {/* Right connection line */}
        <line
          x1={cx + r}
          y1={cy}
          x2={60}
          y2={cy}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Right terminal dot */}
        <circle cx={60} cy={cy} r={3} fill={stateColor} />

        {/* Main compressor circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
        />

        {/* Left triangle arrow (pointing right = compression inward) */}
        <polygon
          points={`${cx - 14},${cy - 7} ${cx - 4},${cy} ${cx - 14},${cy + 7}`}
          fill={stateColor}
          fillOpacity={0.3}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Right triangle arrow (pointing left = compression inward) */}
        <polygon
          points={`${cx + 14},${cy - 7} ${cx + 4},${cy} ${cx + 14},${cy + 7}`}
          fill={stateColor}
          fillOpacity={0.3}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* "C" text */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={stateColor}
          fontSize={10}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
        >
          C
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
