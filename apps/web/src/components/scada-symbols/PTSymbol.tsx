import React from 'react';

interface PTSymbolProps {
  width?: number;
  height?: number;
  ratio?: string;
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function PTSymbol({
  width = 50,
  height = 70,
  ratio = '33kV/110V',
  color = '#1F2937',
  onClick,
  label,
}: PTSymbolProps) {
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line (HV side) */}
      <line
        x1={25}
        y1={0}
        x2={25}
        y2={12}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={25} cy={12} r={1.5} fill={color} />

      {/* IEC PT symbol: two coupled circles (primary winding - top) */}
      <circle
        cx={25}
        cy={22}
        r={10}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />

      {/* Secondary winding (bottom circle, overlapping) */}
      <circle
        cx={25}
        cy={36}
        r={10}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />

      {/* PT marking text inside the overlap region */}
      <text
        x={25}
        y={31}
        textAnchor="middle"
        fill={color}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        PT
      </text>

      {/* Polarity dot on primary */}
      <circle cx={17} cy={17} r={1.5} fill={color} />

      {/* Polarity dot on secondary */}
      <circle cx={17} cy={41} r={1.5} fill={color} />

      {/* Bottom connection line (LV side) */}
      <line
        x1={25}
        y1={46}
        x2={25}
        y2={52}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={25} cy={52} r={1.5} fill={color} />

      {/* Ratio text below */}
      <text
        x={25}
        y={61}
        textAnchor="middle"
        fill={color}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
      >
        {ratio}
      </text>

      {/* Label below ratio */}
      {label && (
        <text
          x={25}
          y={69}
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
