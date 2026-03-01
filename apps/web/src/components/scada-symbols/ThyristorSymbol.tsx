import React from 'react';

interface ThyristorSymbolProps {
  width?: number;
  height?: number;
  state?: 'ON' | 'OFF' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function ThyristorSymbol({
  width = 50,
  height = 60,
  state = 'OFF',
  color,
  onClick,
  label,
}: ThyristorSymbolProps) {
  const stateColor =
    color ||
    (state === 'ON'
      ? '#16A34A'
      : state === 'FAULT'
        ? '#DC2626'
        : '#9CA3AF');

  const strokeWidth = 2;

  // Center x of the symbol
  const cx = 28;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes thyristor-fault-flash {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .thyristor-fault-flash {
              animation: thyristor-fault-flash 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line (anode) */}
      <line
        x1={cx} y1={0} x2={cx} y2={15}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={cx} cy={3} r={3} fill={stateColor} />

      <g className={state === 'FAULT' ? 'thyristor-fault-flash' : undefined}>
        {/* Diode triangle (pointing down, anode at top) */}
        <polygon
          points={`${cx - 10},15 ${cx + 10},15 ${cx},33`}
          fill={state === 'ON' ? stateColor : 'none'}
          fillOpacity={state === 'ON' ? 0.15 : 0}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Cathode bar at bottom of triangle */}
        <line
          x1={cx - 10} y1={33} x2={cx + 10} y2={33}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Gate terminal line (from cathode bar, going left) */}
        <line
          x1={cx - 10} y1={33} x2={cx - 18} y2={24}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Gate terminal dot */}
        <circle cx={cx - 18} cy={24} r={3} fill={stateColor} />

        {/* Gate label "G" */}
        <text
          x={cx - 24}
          y={22}
          fontSize={7}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
          fill={stateColor}
          textAnchor="middle"
        >
          G
        </text>
      </g>

      {/* Bottom connection line (cathode) */}
      <line
        x1={cx} y1={33} x2={cx} y2={48}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={cx} cy={48} r={3} fill={stateColor} />

      {/* Anode label "A" */}
      <text
        x={cx + 14}
        y={10}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
      >
        A
      </text>

      {/* Cathode label "K" */}
      <text
        x={cx + 14}
        y={42}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
      >
        K
      </text>

      {/* Label at bottom */}
      <text
        x={25}
        y={57}
        textAnchor="middle"
        fill={stateColor}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || state}
      </text>
    </svg>
  );
}
