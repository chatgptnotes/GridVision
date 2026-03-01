import React from 'react';

interface FilterSymbolProps {
  width?: number;
  height?: number;
  state?: 'CLEAN' | 'DIRTY' | 'BLOCKED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function FilterSymbol({
  width = 50,
  height = 50,
  state = 'CLEAN',
  color,
  onClick,
  label,
  className,
  rotation,
}: FilterSymbolProps) {
  const stateColor =
    color ||
    (state === 'CLEAN'
      ? '#16A34A'
      : state === 'DIRTY'
        ? '#EAB308'
        : '#DC2626');

  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      className={className}
      role="img"
      aria-label={label || `Filter (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blocked state animation */}
      {state === 'BLOCKED' && (
        <style>
          {`
            @keyframes fault-flash-filter {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.2; }
            }
            .filter-blocked-flash {
              animation: fault-flash-filter 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g className={state === 'BLOCKED' ? 'filter-blocked-flash' : undefined}>
        {/* Top connection line */}
        <line
          x1={25}
          y1={0}
          x2={25}
          y2={8}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Top terminal dot */}
        <circle cx={25} cy={0} r={3} fill={stateColor} />

        {/* Filter cone (triangle pointing down) */}
        <polygon
          points="8,8 42,8 25,40"
          fill={state === 'BLOCKED' ? stateColor : 'none'}
          fillOpacity={state === 'BLOCKED' ? 0.15 : 0}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Filter media lines (horizontal lines inside triangle) */}
        <line
          x1={14}
          y1={16}
          x2={36}
          y2={16}
          stroke={stateColor}
          strokeWidth={1}
          strokeLinecap="round"
        />
        <line
          x1={17}
          y1={22}
          x2={33}
          y2={22}
          stroke={stateColor}
          strokeWidth={1}
          strokeLinecap="round"
        />
        <line
          x1={20}
          y1={28}
          x2={30}
          y2={28}
          stroke={stateColor}
          strokeWidth={1}
          strokeLinecap="round"
        />
        <line
          x1={22}
          y1={34}
          x2={28}
          y2={34}
          stroke={stateColor}
          strokeWidth={1}
          strokeLinecap="round"
        />

        {/* Dirty state: additional dots inside filter */}
        {state === 'DIRTY' && (
          <>
            <circle cx={20} cy={14} r={1.5} fill={stateColor} fillOpacity={0.5} />
            <circle cx={30} cy={14} r={1.5} fill={stateColor} fillOpacity={0.5} />
            <circle cx={25} cy={20} r={1.5} fill={stateColor} fillOpacity={0.5} />
            <circle cx={22} cy={26} r={1.5} fill={stateColor} fillOpacity={0.5} />
          </>
        )}

        {/* Bottom connection line */}
        <line
          x1={25}
          y1={40}
          x2={25}
          y2={50}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Bottom terminal dot */}
        <circle cx={25} cy={50} r={3} fill={stateColor} />
      </g>

      {/* Label */}
      <text
        x={44}
        y={36}
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
