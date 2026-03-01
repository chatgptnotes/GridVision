import React from 'react';

interface ACBSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED' | 'TRIPPED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function ACBSymbol({
  width = 60,
  height = 80,
  state = 'OPEN',
  color,
  onClick,
  label,
}: ACBSymbolProps) {
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
            @keyframes acb-flash-border {
              0%, 100% { stroke-opacity: 1; }
              50% { stroke-opacity: 0.2; }
            }
            .acb-tripped-border {
              animation: acb-flash-border 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line */}
      <line
        x1={30} y1={0} x2={30} y2={20}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={30} cy={20} r={3} fill={stateColor} />

      {/* Bottom connection line */}
      <line
        x1={30} y1={60} x2={30} y2={80}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={30} cy={60} r={3} fill={stateColor} />

      {state === 'CLOSED' && (
        <>
          {/* CB square */}
          <rect
            x={16} y={26} width={28} height={28}
            fill={stateColor}
            fillOpacity={0.15}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* X cross */}
          <line
            x1={16} y1={26} x2={44} y2={54}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={44} y1={26} x2={16} y2={54}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Two parallel arcing chamber lines (right side) */}
          <line
            x1={47} y1={30} x2={47} y2={50}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={51} y1={30} x2={51} y2={50}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Arcing chamber connection lines */}
          <line
            x1={44} y1={34} x2={47} y2={34}
            stroke={stateColor}
            strokeWidth={1.5}
          />
          <line
            x1={44} y1={46} x2={47} y2={46}
            stroke={stateColor}
            strokeWidth={1.5}
          />
          {/* Connection stems */}
          <line
            x1={30} y1={20} x2={30} y2={26}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={54} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'OPEN' && (
        <>
          {/* CB square outline */}
          <rect
            x={16} y={26} width={28} height={28}
            fill="none"
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Open gap lines */}
          <line
            x1={16} y1={26} x2={26} y2={40}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={44} y1={54} x2={34} y2={40}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Two parallel arcing chamber lines (right side) */}
          <line
            x1={47} y1={30} x2={47} y2={50}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={51} y1={30} x2={51} y2={50}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Arcing chamber connection lines */}
          <line
            x1={44} y1={34} x2={47} y2={34}
            stroke={stateColor}
            strokeWidth={1.5}
          />
          <line
            x1={44} y1={46} x2={47} y2={46}
            stroke={stateColor}
            strokeWidth={1.5}
          />
          {/* Connection stems */}
          <line
            x1={30} y1={20} x2={30} y2={26}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={54} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'TRIPPED' && (
        <>
          {/* Flashing outer border */}
          <rect
            className="acb-tripped-border"
            x={12} y={22} width={44} height={36}
            fill="none"
            stroke={stateColor}
            strokeWidth={2.5}
            strokeDasharray="4 2"
            rx={2}
          />
          {/* CB square with X */}
          <rect
            x={16} y={26} width={28} height={28}
            fill={stateColor}
            fillOpacity={0.25}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={16} y1={26} x2={44} y2={54}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={44} y1={26} x2={16} y2={54}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Two parallel arcing chamber lines */}
          <line
            x1={47} y1={30} x2={47} y2={50}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={51} y1={30} x2={51} y2={50}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={44} y1={34} x2={47} y2={34}
            stroke={stateColor}
            strokeWidth={1.5}
          />
          <line
            x1={44} y1={46} x2={47} y2={46}
            stroke={stateColor}
            strokeWidth={1.5}
          />
          {/* Connection stems */}
          <line
            x1={30} y1={20} x2={30} y2={26}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={54} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Exclamation indicator */}
          <text
            x={54}
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
