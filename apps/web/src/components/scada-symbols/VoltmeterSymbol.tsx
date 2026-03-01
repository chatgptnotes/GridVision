import React from 'react';

interface VoltmeterSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function VoltmeterSymbol({
  width = 50,
  height = 50,
  state = 'ACTIVE',
  color,
  onClick,
  label,
}: VoltmeterSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;
  const cx = 25;
  const cy = 20;
  const radius = 15;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Voltmeter (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#FFFFFF"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* "V" text inside (bold) */}
      <text
        x={cx}
        y={25}
        textAnchor="middle"
        fill={stateColor}
        fontSize={16}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        V
      </text>

      {/* Bottom left connection line (parallel connection) */}
      <line
        x1={19}
        y1={cy + radius}
        x2={19}
        y2={43}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Bottom left terminal dot */}
      <circle cx={19} cy={43} r={3} fill={stateColor} />

      {/* Bottom right connection line (parallel connection) */}
      <line
        x1={31}
        y1={cy + radius}
        x2={31}
        y2={43}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Bottom right terminal dot */}
      <circle cx={31} cy={43} r={3} fill={stateColor} />

      {/* Label below */}
      <text
        x={cx}
        y={49}
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
