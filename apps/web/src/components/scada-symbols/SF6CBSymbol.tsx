import React from 'react';

interface SF6CBSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED' | 'TRIPPED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SF6CBSymbol({
  width = 60,
  height = 80,
  state = 'OPEN',
  color,
  onClick,
  label,
}: SF6CBSymbolProps) {
  const stateColor =
    color ||
    (state === 'CLOSED'
      ? '#16A34A'
      : state === 'TRIPPED'
        ? '#DC2626'
        : '#DC2626');

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
      {state === 'TRIPPED' && (
        <style>
          {`
            @keyframes sf6cb-flash-border {
              0%, 100% { stroke-opacity: 1; }
              50% { stroke-opacity: 0.2; }
            }
            .sf6cb-tripped-border {
              animation: sf6cb-flash-border 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line */}
      <line
        x1={30} y1={0} x2={30} y2={16}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={30} cy={16} r={3} fill={stateColor} />

      {/* Bottom connection line */}
      <line
        x1={30} y1={60} x2={30} y2={80}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={30} cy={60} r={3} fill={stateColor} />

      {/* Hexagonal gas compartment outline */}
      <polygon
        points="30,14 48,24 48,52 30,62 12,52 12,24"
        fill={state === 'CLOSED' ? stateColor : 'none'}
        fillOpacity={state === 'CLOSED' ? 0.08 : 0}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* SF6 text label */}
      <text
        x={30}
        y={22}
        textAnchor="middle"
        fill={stateColor}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        opacity={0.7}
      >
        SF6
      </text>

      {state === 'CLOSED' && (
        <>
          {/* IEC CB symbol: square with X cross (closed) */}
          <rect
            x={20} y={28} width={20} height={20}
            fill={stateColor}
            fillOpacity={0.15}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={20} y1={28} x2={40} y2={48}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={40} y1={28} x2={20} y2={48}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Connection stems */}
          <line
            x1={30} y1={16} x2={30} y2={28}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={48} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'OPEN' && (
        <>
          {/* IEC CB symbol: square with open gap */}
          <rect
            x={20} y={28} width={20} height={20}
            fill="none"
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Open gap lines */}
          <line
            x1={20} y1={28} x2={28} y2={38}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={40} y1={48} x2={32} y2={38}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Connection stems */}
          <line
            x1={30} y1={16} x2={30} y2={28}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={48} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'TRIPPED' && (
        <>
          {/* Flashing outer hexagonal border */}
          <polygon
            className="sf6cb-tripped-border"
            points="30,10 52,22 52,54 30,66 8,54 8,22"
            fill="none"
            stroke={stateColor}
            strokeWidth={2.5}
            strokeDasharray="4 2"
            strokeLinejoin="round"
          />
          {/* CB square with X (tripped) */}
          <rect
            x={20} y={28} width={20} height={20}
            fill={stateColor}
            fillOpacity={0.25}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={20} y1={28} x2={40} y2={48}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={40} y1={28} x2={20} y2={48}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Connection stems */}
          <line
            x1={30} y1={16} x2={30} y2={28}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={48} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Exclamation indicator */}
          <text
            x={52}
            y={28}
            fill={stateColor}
            fontSize={12}
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            !
          </text>
        </>
      )}

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
