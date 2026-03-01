import React from 'react';

interface BusSectionSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function BusSectionSymbol({
  width = 80,
  height = 40,
  state = 'CLOSED',
  color,
  onClick,
  label,
}: BusSectionSymbolProps) {
  const stateColor = color || (state === 'CLOSED' ? '#1E40AF' : '#9CA3AF');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 40"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left bus bar segment */}
      <line
        x1={0}
        y1={16}
        x2={28}
        y2={16}
        stroke={stateColor}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Right bus bar segment */}
      <line
        x1={52}
        y1={16}
        x2={80}
        y2={16}
        stroke={stateColor}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Left terminal dot */}
      <circle cx={0} cy={16} r={3} fill={stateColor} />

      {/* Right terminal dot */}
      <circle cx={80} cy={16} r={3} fill={stateColor} />

      {/* Switch/CB symbol at split point */}
      {state === 'CLOSED' ? (
        <>
          {/* Closed: filled square with X connecting the two bus segments */}
          <rect
            x={29}
            y={7}
            width={22}
            height={18}
            fill={stateColor}
            fillOpacity={0.15}
            stroke={stateColor}
            strokeWidth={2}
          />
          <line
            x1={29}
            y1={7}
            x2={51}
            y2={25}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={51}
            y1={7}
            x2={29}
            y2={25}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Open: square outline with gap indication */}
          <rect
            x={29}
            y={7}
            width={22}
            height={18}
            fill="none"
            stroke={stateColor}
            strokeWidth={2}
          />
          {/* Open gap lines (not meeting) */}
          <line
            x1={29}
            y1={7}
            x2={37}
            y2={16}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={51}
            y1={25}
            x2={43}
            y2={16}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      )}

      {/* Terminal dots at switch contacts */}
      <circle cx={28} cy={16} r={2.5} fill={stateColor} />
      <circle cx={52} cy={16} r={2.5} fill={stateColor} />

      {/* Label */}
      {label && (
        <text
          x={40}
          y={36}
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
