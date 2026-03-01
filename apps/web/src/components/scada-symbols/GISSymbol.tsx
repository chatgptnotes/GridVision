import React from 'react';

interface GISSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function GISSymbol({
  width = 70,
  height = 80,
  state = 'DE_ENERGIZED',
  color,
  onClick,
  label,
}: GISSymbolProps) {
  const stateColor =
    color ||
    (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');

  const strokeWidth = 2.5;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={35} y1={0} x2={35} y2={10}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={35} cy={10} r={3} fill={stateColor} />

      {/* Bottom connection line */}
      <line
        x1={35} y1={62} x2={35} y2={72}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={35} cy={62} r={3} fill={stateColor} />

      {/* Hexagonal outline (gas insulation enclosure) */}
      <polygon
        points="35,8 58,18 58,54 35,64 12,54 12,18"
        fill={state === 'ENERGIZED' ? stateColor : 'none'}
        fillOpacity={state === 'ENERGIZED' ? 0.08 : 0}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Inner CB symbol: square with X */}
      {state === 'ENERGIZED' ? (
        <>
          {/* Closed CB */}
          <rect
            x={24} y={25} width={22} height={22}
            fill={stateColor}
            fillOpacity={0.15}
            stroke={stateColor}
            strokeWidth={2}
          />
          <line
            x1={24} y1={25} x2={46} y2={47}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={46} y1={25} x2={24} y2={47}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Connection from top terminal to CB */}
          <line
            x1={35} y1={10} x2={35} y2={25}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Connection from CB to bottom terminal */}
          <line
            x1={35} y1={47} x2={35} y2={62}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      ) : (
        <>
          {/* Open CB */}
          <rect
            x={24} y={25} width={22} height={22}
            fill="none"
            stroke={stateColor}
            strokeWidth={2}
          />
          <line
            x1={24} y1={25} x2={33} y2={36}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={46} y1={47} x2={37} y2={36}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Connection from top terminal to CB */}
          <line
            x1={35} y1={10} x2={35} y2={25}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Connection from CB to bottom terminal */}
          <line
            x1={35} y1={47} x2={35} y2={62}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {/* "GIS" label inside hexagon (top) */}
      <text
        x={35}
        y={20}
        textAnchor="middle"
        fill={stateColor}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        opacity={0.7}
      >
        GIS
      </text>

      {/* Gas fill indicator lines (decorative, inside hexagon) */}
      <line
        x1={16} y1={50} x2={20} y2={50}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.4}
      />
      <line
        x1={50} y1={50} x2={54} y2={50}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.4}
      />
      <line
        x1={16} y1={22} x2={20} y2={22}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.4}
      />
      <line
        x1={50} y1={22} x2={54} y2={22}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.4}
      />

      {/* Label */}
      <text
        x={35}
        y={78}
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
