import React from 'react';

interface CrossoverSymbolProps {
  width?: number;
  height?: number;
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function CrossoverSymbol({
  width = 40,
  height = 40,
  color,
  onClick,
  label,
}: CrossoverSymbolProps) {
  const lineColor = color || '#374151';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Horizontal straight-through line (underneath) */}
      <line
        x1={2}
        y1={20}
        x2={38}
        y2={20}
        stroke={lineColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Vertical line — bottom segment (comes up to just before crossing) */}
      <line
        x1={20}
        y1={38}
        x2={20}
        y2={25}
        stroke={lineColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Semicircle bump over the horizontal line (indicates no connection) */}
      <path
        d="M 20 25 A 5 5 0 0 1 20 15"
        fill="none"
        stroke={lineColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Vertical line — top segment (from bump to top) */}
      <line
        x1={20}
        y1={15}
        x2={20}
        y2={2}
        stroke={lineColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Terminal dots at all four ends */}
      <circle cx={2} cy={20} r={2.5} fill={lineColor} />
      <circle cx={38} cy={20} r={2.5} fill={lineColor} />
      <circle cx={20} cy={2} r={2.5} fill={lineColor} />
      <circle cx={20} cy={38} r={2.5} fill={lineColor} />

      {/* Label */}
      {label && (
        <text
          x={20}
          y={39}
          textAnchor="middle"
          fill={lineColor}
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
