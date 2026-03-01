import React from 'react';

interface CTSymbolProps {
  width?: number;
  height?: number;
  ratio?: string;
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function CTSymbol({
  width = 50,
  height = 60,
  ratio = '200/5A',
  color = '#1F2937',
  onClick,
  label,
}: CTSymbolProps) {
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Primary conductor line (horizontal through CT) */}
      <line
        x1={0}
        y1={22}
        x2={50}
        y2={22}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* IEC CT symbol: toroidal core represented as a circle on the conductor */}
      <circle
        cx={25}
        cy={22}
        r={10}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />

      {/* Secondary winding indicator: small arc/partial circle below main circle */}
      <path
        d="M 18 30 A 7 7 0 0 0 32 30"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Secondary terminal leads */}
      <line
        x1={18}
        y1={30}
        x2={18}
        y2={36}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={32}
        y1={30}
        x2={32}
        y2={36}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Secondary terminal dots */}
      <circle cx={18} cy={36} r={1.5} fill={color} />
      <circle cx={32} cy={36} r={1.5} fill={color} />

      {/* Polarity dot on primary side */}
      <circle cx={17} cy={17} r={1.5} fill={color} />

      {/* Ratio text below */}
      <text
        x={25}
        y={47}
        textAnchor="middle"
        fill={color}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
      >
        {ratio}
      </text>

      {/* Label below ratio */}
      {label && (
        <text
          x={25}
          y={56}
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
