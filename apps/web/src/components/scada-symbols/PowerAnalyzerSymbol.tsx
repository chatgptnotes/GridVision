import React from 'react';

interface PowerAnalyzerSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function PowerAnalyzerSymbol({
  width = 50,
  height = 60,
  state = 'ACTIVE',
  color,
  onClick,
  label,
}: PowerAnalyzerSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Power Quality Analyzer (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main rectangle body (larger) */}
      <rect
        x={8}
        y={4}
        width={34}
        height={42}
        rx={3}
        fill="#FFFFFF"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* "PQA" text */}
      <text
        x={25}
        y={18}
        textAnchor="middle"
        fill={stateColor}
        fontSize={9}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        PQA
      </text>

      {/* Small waveform indicator lines inside */}
      <polyline
        points="14,28 17,24 20,32 23,22 26,34 29,24 32,30 35,26"
        fill="none"
        stroke={state === 'ACTIVE' ? '#16A34A' : '#D1D5DB'}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Waveform baseline */}
      <line
        x1={14}
        y1={28}
        x2={35}
        y2={28}
        stroke={stateColor}
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeDasharray="1,2"
      />

      {/* Status indicator dot */}
      <circle
        cx={35}
        cy={10}
        r={2.5}
        fill={state === 'ACTIVE' ? '#16A34A' : '#D1D5DB'}
      />

      {/* 3-phase left connections (L1, L2, L3) */}
      {[14, 25, 36].map((y, i) => (
        <g key={`left-${i}`}>
          <line
            x1={0}
            y1={y}
            x2={8}
            y2={y}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={0} cy={y} r={3} fill={stateColor} />
        </g>
      ))}

      {/* 3-phase right connections (L1, L2, L3) */}
      {[14, 25, 36].map((y, i) => (
        <g key={`right-${i}`}>
          <line
            x1={42}
            y1={y}
            x2={50}
            y2={y}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <circle cx={50} cy={y} r={3} fill={stateColor} />
        </g>
      ))}

      {/* Label below */}
      <text
        x={25}
        y={55}
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
