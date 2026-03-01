import React from 'react';

interface JunctionSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function JunctionSymbol({
  width = 40,
  height = 40,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
}: JunctionSymbolProps) {
  const stateColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Horizontal line — full width */}
      <line
        x1={2}
        y1={12}
        x2={38}
        y2={12}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Vertical branch line — from center downward */}
      <line
        x1={20}
        y1={12}
        x2={20}
        y2={35}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Filled junction dot at T-junction point */}
      <circle cx={20} cy={12} r={4} fill={stateColor} />

      {/* Left terminal dot */}
      <circle cx={2} cy={12} r={2.5} fill={stateColor} />

      {/* Right terminal dot */}
      <circle cx={38} cy={12} r={2.5} fill={stateColor} />

      {/* Bottom terminal dot */}
      <circle cx={20} cy={35} r={2.5} fill={stateColor} />

      {/* Label */}
      {label && (
        <text
          x={20}
          y={39}
          textAnchor="middle"
          fill={stateColor}
          fontSize={6}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
