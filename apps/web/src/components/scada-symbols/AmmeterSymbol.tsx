import React from 'react';

interface AmmeterSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function AmmeterSymbol({
  width = 50,
  height = 50,
  state = 'ACTIVE',
  color,
  onClick,
  label,
}: AmmeterSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;
  const cx = 25;
  const cy = 22;
  const radius = 15;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Ammeter (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left connection line through the circle */}
      <line
        x1={0}
        y1={cy}
        x2={cx - radius}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Left terminal dot */}
      <circle cx={0} cy={cy} r={3} fill={stateColor} />

      {/* Right connection line through the circle */}
      <line
        x1={cx + radius}
        y1={cy}
        x2={50}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Right terminal dot */}
      <circle cx={50} cy={cy} r={3} fill={stateColor} />

      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#FFFFFF"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* "A" text inside (bold) */}
      <text
        x={cx}
        y={27}
        textAnchor="middle"
        fill={stateColor}
        fontSize={16}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        A
      </text>

      {/* Label below */}
      <text
        x={cx}
        y={47}
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
