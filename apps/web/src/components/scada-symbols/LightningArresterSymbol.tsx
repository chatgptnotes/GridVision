import React from 'react';

interface LightningArresterSymbolProps {
  width?: number;
  height?: number;
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function LightningArresterSymbol({
  width = 40,
  height = 70,
  color = '#374151',
  onClick,
  label,
}: LightningArresterSymbolProps) {
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={20}
        y1={0}
        x2={20}
        y2={8}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={20} cy={8} r={2} fill={color} />

      {/* IEC Surge Arrester body — zigzag (lightning) pattern */}
      <polyline
        points="20,8 20,12 12,18 28,24 12,30 28,36 12,42 20,48"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Connection from zigzag to ground */}
      <line
        x1={20}
        y1={48}
        x2={20}
        y2={52}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Ground symbol — three horizontal lines of decreasing width */}
      {/* First ground line (widest) */}
      <line
        x1={8}
        y1={52}
        x2={32}
        y2={52}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Second ground line */}
      <line
        x1={12}
        y1={56}
        x2={28}
        y2={56}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Third ground line (narrowest) */}
      <line
        x1={16}
        y1={60}
        x2={24}
        y2={60}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Label */}
      {label && (
        <text
          x={20}
          y={68}
          textAnchor="middle"
          fill={color}
          fontSize={7}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
