import React from 'react';

interface OverheadLineSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function OverheadLineSymbol({
  width = 120,
  height = 40,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
}: OverheadLineSymbolProps) {
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
      {/* Main conductor line running between towers */}
      <line
        x1={5}
        y1={14}
        x2={115}
        y2={14}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Tower 1 — inverted triangle pylon at x=20 */}
      <polygon
        points="14,4 26,4 20,18"
        fill="none"
        stroke={stateColor}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* Tower 1 base line (crossarm) */}
      <line
        x1={14}
        y1={4}
        x2={26}
        y2={4}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Tower 2 — inverted triangle pylon at x=50 */}
      <polygon
        points="44,4 56,4 50,18"
        fill="none"
        stroke={stateColor}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <line
        x1={44}
        y1={4}
        x2={56}
        y2={4}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Tower 3 — inverted triangle pylon at x=80 */}
      <polygon
        points="74,4 86,4 80,18"
        fill="none"
        stroke={stateColor}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <line
        x1={74}
        y1={4}
        x2={86}
        y2={4}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Tower 4 — inverted triangle pylon at x=110 */}
      <polygon
        points="104,4 116,4 110,18"
        fill="none"
        stroke={stateColor}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <line
        x1={104}
        y1={4}
        x2={116}
        y2={4}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Left terminal dot */}
      <circle cx={5} cy={14} r={3} fill={stateColor} />

      {/* Right terminal dot */}
      <circle cx={115} cy={14} r={3} fill={stateColor} />

      {/* Label */}
      {label && (
        <text
          x={60}
          y={32}
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
