import React from 'react';

interface SectionalizerSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SectionalizerSymbol({
  width = 60,
  height = 80,
  state = 'OPEN',
  color,
  onClick,
  label,
}: SectionalizerSymbolProps) {
  const stateColor =
    color ||
    (state === 'CLOSED' ? '#16A34A' : '#DC2626');

  const strokeWidth = 2.5;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={30} y1={0} x2={30} y2={18}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={30} cy={18} r={3} fill={stateColor} />

      {/* Bottom connection line */}
      <line
        x1={30} y1={60} x2={30} y2={80}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={30} cy={60} r={3} fill={stateColor} />

      {/* Circle with "S" indicator */}
      <circle
        cx={30}
        cy={39}
        r={16}
        fill={state === 'CLOSED' ? stateColor : 'none'}
        fillOpacity={state === 'CLOSED' ? 0.1 : 0}
        stroke={stateColor}
        strokeWidth={2}
      />

      {/* "S" label inside circle */}
      <text
        x={30}
        y={43}
        textAnchor="middle"
        fill={stateColor}
        fontSize={14}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        S
      </text>

      {state === 'CLOSED' && (
        <>
          {/* Switch blade (closed - vertical connecting terminals) */}
          <line
            x1={30} y1={18} x2={30} y2={23}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={30} y1={55} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </>
      )}

      {state === 'OPEN' && (
        <>
          {/* Switch blade (open - angled away) */}
          <line
            x1={30} y1={18} x2={30} y2={23}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={30} y1={55} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Open gap indicator dashes */}
          <line
            x1={26} y1={24} x2={34} y2={24}
            stroke={stateColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <line
            x1={26} y1={54} x2={34} y2={54}
            stroke={stateColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      )}

      {/* Counting indicator (three small dots at bottom of circle) */}
      <circle cx={24} cy={52} r={1.5} fill={stateColor} />
      <circle cx={30} cy={52} r={1.5} fill={stateColor} />
      <circle cx={36} cy={52} r={1.5} fill={stateColor} />

      {/* Label */}
      <text
        x={30}
        y={75}
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
