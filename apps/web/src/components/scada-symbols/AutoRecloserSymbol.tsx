import React from 'react';

interface AutoRecloserSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED' | 'LOCKOUT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function AutoRecloserSymbol({
  width = 60,
  height = 80,
  state = 'OPEN',
  color,
  onClick,
  label,
}: AutoRecloserSymbolProps) {
  const stateColor =
    color ||
    (state === 'CLOSED'
      ? '#16A34A'
      : state === 'LOCKOUT'
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
      {state === 'LOCKOUT' && (
        <style>
          {`
            @keyframes autorecloser-flash-border {
              0%, 100% { stroke-opacity: 1; }
              50% { stroke-opacity: 0.2; }
            }
            .autorecloser-tripped-border {
              animation: autorecloser-flash-border 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

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

      {state === 'CLOSED' && (
        <>
          {/* IEC CB symbol: square with X (closed) */}
          <rect
            x={16} y={24} width={28} height={28}
            fill={stateColor}
            fillOpacity={0.15}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={16} y1={24} x2={44} y2={52}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={44} y1={24} x2={16} y2={52}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Connection stems */}
          <line
            x1={30} y1={18} x2={30} y2={24}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={52} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Auto-reclose circular arrow (top right) */}
          <path
            d="M 50 20 A 6 6 0 1 1 44 14"
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* Arrow head */}
          <polygon
            points="44,14 47,16 44,18"
            fill={stateColor}
          />
          {/* AR label */}
          <text
            x={48}
            y={30}
            textAnchor="middle"
            fill={stateColor}
            fontSize={6}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            AR
          </text>
        </>
      )}

      {state === 'OPEN' && (
        <>
          {/* IEC CB symbol: square with open gap */}
          <rect
            x={16} y={24} width={28} height={28}
            fill="none"
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={16} y1={24} x2={26} y2={38}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={44} y1={52} x2={34} y2={38}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Connection stems */}
          <line
            x1={30} y1={18} x2={30} y2={24}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={52} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Auto-reclose circular arrow */}
          <path
            d="M 50 20 A 6 6 0 1 1 44 14"
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <polygon
            points="44,14 47,16 44,18"
            fill={stateColor}
          />
          {/* AR label */}
          <text
            x={48}
            y={30}
            textAnchor="middle"
            fill={stateColor}
            fontSize={6}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            AR
          </text>
        </>
      )}

      {state === 'LOCKOUT' && (
        <>
          {/* Flashing outer border */}
          <rect
            className="autorecloser-tripped-border"
            x={12} y={20} width={36} height={36}
            fill="none"
            stroke={stateColor}
            strokeWidth={2.5}
            strokeDasharray="4 2"
            rx={2}
          />
          {/* CB square with X (locked out) */}
          <rect
            x={16} y={24} width={28} height={28}
            fill={stateColor}
            fillOpacity={0.25}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={16} y1={24} x2={44} y2={52}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={44} y1={24} x2={16} y2={52}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Connection stems */}
          <line
            x1={30} y1={18} x2={30} y2={24}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={52} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Lock icon (top right) */}
          {/* Lock body */}
          <rect
            x={46} y={18} width={10} height={8}
            fill={stateColor}
            fillOpacity={0.3}
            stroke={stateColor}
            strokeWidth={1.5}
            rx={1}
          />
          {/* Lock shackle */}
          <path
            d="M 48 18 V 15 A 3 3 0 0 1 54 15 V 18"
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* Lock keyhole */}
          <circle cx={51} cy={22} r={1} fill={stateColor} />
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
