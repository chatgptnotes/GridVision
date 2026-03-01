import React from 'react';

interface UndergroundCableSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function UndergroundCableSymbol({
  width = 120,
  height = 20,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
}: UndergroundCableSymbolProps) {
  const stateColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 20"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dashed cable line */}
      <line
        x1={5}
        y1={8}
        x2={115}
        y2={8}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="8 4"
      />

      {/* Ground symbol 1 at x=30 */}
      <line x1={27} y1={11} x2={33} y2={11} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />
      <line x1={28.5} y1={13.5} x2={31.5} y2={13.5} stroke={stateColor} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={29.5} y1={16} x2={30.5} y2={16} stroke={stateColor} strokeWidth={1} strokeLinecap="round" />

      {/* Ground symbol 2 at x=60 */}
      <line x1={57} y1={11} x2={63} y2={11} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />
      <line x1={58.5} y1={13.5} x2={61.5} y2={13.5} stroke={stateColor} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={59.5} y1={16} x2={60.5} y2={16} stroke={stateColor} strokeWidth={1} strokeLinecap="round" />

      {/* Ground symbol 3 at x=90 */}
      <line x1={87} y1={11} x2={93} y2={11} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />
      <line x1={88.5} y1={13.5} x2={91.5} y2={13.5} stroke={stateColor} strokeWidth={1.5} strokeLinecap="round" />
      <line x1={89.5} y1={16} x2={90.5} y2={16} stroke={stateColor} strokeWidth={1} strokeLinecap="round" />

      {/* Left terminal dot */}
      <circle cx={5} cy={8} r={3} fill={stateColor} />

      {/* Right terminal dot */}
      <circle cx={115} cy={8} r={3} fill={stateColor} />

      {/* Label */}
      {label && (
        <text
          x={60}
          y={19}
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
