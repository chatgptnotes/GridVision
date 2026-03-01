import React from 'react';

interface BusTieSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function BusTieSymbol({
  width = 40,
  height = 60,
  state = 'CLOSED',
  color,
  onClick,
  label,
}: BusTieSymbolProps) {
  const stateColor = color || (state === 'CLOSED' ? '#1E40AF' : '#9CA3AF');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top horizontal bus stub */}
      <line
        x1={5}
        y1={5}
        x2={35}
        y2={5}
        stroke={stateColor}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Bottom horizontal bus stub */}
      <line
        x1={5}
        y1={50}
        x2={35}
        y2={50}
        stroke={stateColor}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Vertical line — top segment (from top bus to switch) */}
      <line
        x1={20}
        y1={5}
        x2={20}
        y2={20}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Vertical line — bottom segment (from switch to bottom bus) */}
      <line
        x1={20}
        y1={35}
        x2={20}
        y2={50}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Switch in the middle */}
      {state === 'CLOSED' ? (
        <>
          {/* Closed switch: filled square with X */}
          <rect
            x={11}
            y={20}
            width={18}
            height={15}
            fill={stateColor}
            fillOpacity={0.15}
            stroke={stateColor}
            strokeWidth={2}
          />
          <line
            x1={11}
            y1={20}
            x2={29}
            y2={35}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={29}
            y1={20}
            x2={11}
            y2={35}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Open switch: square outline with gap */}
          <rect
            x={11}
            y={20}
            width={18}
            height={15}
            fill="none"
            stroke={stateColor}
            strokeWidth={2}
          />
          {/* Open gap lines */}
          <line
            x1={11}
            y1={20}
            x2={17}
            y2={27.5}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={29}
            y1={35}
            x2={23}
            y2={27.5}
            stroke={stateColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      )}

      {/* Terminal dots at switch contacts */}
      <circle cx={20} cy={20} r={2.5} fill={stateColor} />
      <circle cx={20} cy={35} r={2.5} fill={stateColor} />

      {/* Terminal dots at bus ends */}
      <circle cx={5} cy={5} r={2.5} fill={stateColor} />
      <circle cx={35} cy={5} r={2.5} fill={stateColor} />
      <circle cx={5} cy={50} r={2.5} fill={stateColor} />
      <circle cx={35} cy={50} r={2.5} fill={stateColor} />

      {/* Label */}
      {label && (
        <text
          x={20}
          y={58}
          textAnchor="middle"
          fill={stateColor}
          fontSize={6}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
