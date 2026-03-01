import React from 'react';

interface TerminalSymbolProps {
  width?: number;
  height?: number;
  state?: 'CONNECTED' | 'DISCONNECTED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function TerminalSymbol({
  width = 30,
  height = 30,
  state = 'CONNECTED',
  color,
  onClick,
  label,
}: TerminalSymbolProps) {
  const stateColor = color || (state === 'CONNECTED' ? '#1E40AF' : '#9CA3AF');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={15}
        y1={2}
        x2={15}
        y2={9}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Bottom connection line */}
      <line
        x1={15}
        y1={21}
        x2={15}
        y2={28}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Main terminal circle */}
      <circle
        cx={15}
        cy={15}
        r={6}
        fill={state === 'CONNECTED' ? stateColor : 'none'}
        stroke={stateColor}
        strokeWidth={2}
      />

      {/* Top terminal dot */}
      <circle cx={15} cy={2} r={2} fill={stateColor} />

      {/* Bottom terminal dot */}
      <circle cx={15} cy={28} r={2} fill={stateColor} />

      {/* Label */}
      {label && (
        <text
          x={15}
          y={29}
          textAnchor="middle"
          fill={stateColor}
          fontSize={5}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
