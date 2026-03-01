import React from 'react';

interface DoubleBusBarSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function DoubleBusBarSymbol({
  width = 120,
  height = 40,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
}: DoubleBusBarSymbolProps) {
  const stateColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 40"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bus 1 — Top horizontal bar */}
      <line
        x1={5}
        y1={10}
        x2={115}
        y2={10}
        stroke={stateColor}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Bus 2 — Bottom horizontal bar */}
      <line
        x1={5}
        y1={30}
        x2={115}
        y2={30}
        stroke={stateColor}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Bus coupler — vertical connection between Bus 1 and Bus 2 */}
      <line
        x1={60}
        y1={10}
        x2={60}
        y2={30}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Left terminal dot — Bus 1 */}
      <circle cx={5} cy={10} r={3} fill={stateColor} />

      {/* Right terminal dot — Bus 1 */}
      <circle cx={115} cy={10} r={3} fill={stateColor} />

      {/* Left terminal dot — Bus 2 */}
      <circle cx={5} cy={30} r={3} fill={stateColor} />

      {/* Right terminal dot — Bus 2 */}
      <circle cx={115} cy={30} r={3} fill={stateColor} />

      {/* Coupler junction dots */}
      <circle cx={60} cy={10} r={2.5} fill={stateColor} />
      <circle cx={60} cy={30} r={2.5} fill={stateColor} />

      {/* Label */}
      {label && (
        <text
          x={60}
          y={39}
          textAnchor="middle"
          fill={stateColor}
          fontSize={7}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
