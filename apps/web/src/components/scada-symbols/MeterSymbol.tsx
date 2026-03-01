import React from 'react';

interface MeterSymbolProps {
  width?: number;
  height?: number;
  meterType?: 'V' | 'A' | 'W' | 'Hz' | 'PF';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function MeterSymbol({
  width = 50,
  height = 50,
  meterType = 'V',
  color = '#1F2937',
  onClick,
  label,
}: MeterSymbolProps) {
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left connection line */}
      <line
        x1={0}
        y1={22}
        x2={7}
        y2={22}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Right connection line */}
      <line
        x1={43}
        y1={22}
        x2={50}
        y2={22}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Left terminal dot */}
      <circle cx={7} cy={22} r={1.5} fill={color} />

      {/* Right terminal dot */}
      <circle cx={43} cy={22} r={1.5} fill={color} />

      {/* IEC meter symbol: circle */}
      <circle
        cx={25}
        cy={22}
        r={15}
        fill="white"
        stroke={color}
        strokeWidth={strokeWidth}
      />

      {/* Meter type letter inside circle */}
      <text
        x={25}
        y={27}
        textAnchor="middle"
        fill={color}
        fontSize={14}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        {meterType}
      </text>

      {/* Label below */}
      {label && (
        <text
          x={25}
          y={46}
          textAnchor="middle"
          fill={color}
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
