import React from 'react';

interface RelaySymbolProps {
  width?: number;
  height?: number;
  ansiNumber?: number | string;
  status?: 'NORMAL' | 'OPERATED' | 'BLOCKED';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function RelaySymbol({
  width = 60,
  height = 50,
  ansiNumber = 50,
  status = 'NORMAL',
  color,
  onClick,
  label,
}: RelaySymbolProps) {
  // Status-based colors
  const borderColor =
    color ||
    (status === 'NORMAL'
      ? '#1E3A5F'
      : status === 'OPERATED'
        ? '#DC2626'
        : '#D97706');

  const fillColor =
    status === 'NORMAL'
      ? '#EFF6FF'
      : status === 'OPERATED'
        ? '#FEF2F2'
        : '#FFFBEB';

  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main relay body rectangle */}
      <rect
        x={4}
        y={3}
        width={52}
        height={34}
        fill={fillColor}
        stroke={borderColor}
        strokeWidth={strokeWidth}
        rx={2}
      />

      {/* ANSI device number prominently in center */}
      <text
        x={30}
        y={26}
        textAnchor="middle"
        fill={borderColor}
        fontSize={16}
        fontFamily="Arial, sans-serif"
        fontWeight="800"
      >
        {ansiNumber}
      </text>

      {/* Small relay coil symbol in top-right corner */}
      {/* Coil represented as a small semicircle/arc pattern */}
      <path
        d="M 44 7 Q 46 9, 44 11 Q 42 13, 44 15"
        fill="none"
        stroke={borderColor}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <path
        d="M 47 7 Q 49 9, 47 11 Q 45 13, 47 15"
        fill="none"
        stroke={borderColor}
        strokeWidth={1.2}
        strokeLinecap="round"
      />

      {/* OPERATED state: red alert indicator (exclamation triangle) */}
      {status === 'OPERATED' && (
        <>
          {/* Alert triangle in top-left */}
          <polygon
            points="10,6 14,6 12,10"
            fill={borderColor}
            stroke="none"
          />
          <text
            x={12}
            y={9.5}
            textAnchor="middle"
            fill="white"
            fontSize={3.5}
            fontFamily="Arial, sans-serif"
            fontWeight="700"
          >
            !
          </text>

          {/* Pulsing border for operated state */}
          <style>
            {`
              @keyframes relay-pulse {
                0%, 100% { stroke-opacity: 1; }
                50% { stroke-opacity: 0.3; }
              }
              .relay-operated-border {
                animation: relay-pulse 1s ease-in-out infinite;
              }
            `}
          </style>
          <rect
            className="relay-operated-border"
            x={2}
            y={1}
            width={56}
            height={38}
            fill="none"
            stroke={borderColor}
            strokeWidth={1.5}
            strokeDasharray="3 2"
            rx={3}
          />
        </>
      )}

      {/* BLOCKED state: orange/yellow strike-through */}
      {status === 'BLOCKED' && (
        <>
          {/* Diagonal strike-through line */}
          <line
            x1={8}
            y1={33}
            x2={52}
            y2={7}
            stroke={borderColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.7}
          />
          {/* Second parallel line for visibility */}
          <line
            x1={8}
            y1={36}
            x2={52}
            y2={10}
            stroke={borderColor}
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.5}
          />

          {/* BLOCKED text indicator */}
          <rect
            x={15}
            y={30}
            width={30}
            height={8}
            fill="white"
            stroke={borderColor}
            strokeWidth={0.5}
            rx={1}
          />
          <text
            x={30}
            y={36.5}
            textAnchor="middle"
            fill={borderColor}
            fontSize={5}
            fontFamily="Arial, sans-serif"
            fontWeight="700"
          >
            BLOCKED
          </text>
        </>
      )}

      {/* Connection terminals - left and right */}
      <circle cx={4} cy={20} r={2} fill={borderColor} />
      <circle cx={56} cy={20} r={2} fill={borderColor} />

      {/* Label / status text below */}
      <text
        x={30}
        y={46}
        textAnchor="middle"
        fill={borderColor}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || status}
      </text>
    </svg>
  );
}
