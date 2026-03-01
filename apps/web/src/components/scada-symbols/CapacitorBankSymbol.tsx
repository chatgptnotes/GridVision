import React from 'react';

interface CapacitorBankSymbolProps {
  width?: number;
  height?: number;
  state?: 'CONNECTED' | 'DISCONNECTED';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function CapacitorBankSymbol({
  width = 60,
  height = 70,
  state = 'CONNECTED',
  color,
  onClick,
  label,
}: CapacitorBankSymbolProps) {
  const strokeColor = color || (state === 'CONNECTED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'CONNECTED' ? '#1E293B' : '#9CA3AF';

  // IEC capacitor: two parallel plates - one straight line, one curved arc
  // Bank arrangement: 3 capacitor elements side by side
  const plateGap = 5;
  const plateWidth = 12;
  const centerY = 32;

  // Positions for 3 capacitor elements in the bank
  const positions = [12, 30, 48];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Capacitor Bank (${state})`}
    >
      {/* Top bus bar (horizontal connection line) */}
      <line
        x1={positions[0]}
        y1={10}
        x2={positions[positions.length - 1]}
        y2={10}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Top connection line to bus */}
      <line
        x1={30}
        y1={0}
        x2={30}
        y2={10}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Render each capacitor element in the bank */}
      {positions.map((px, idx) => (
        <g key={idx}>
          {/* Vertical lead from top bus to upper plate */}
          <line
            x1={px}
            y1={10}
            x2={px}
            y2={centerY - plateGap}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />

          {/* Upper plate (straight line - IEC standard) */}
          <line
            x1={px - plateWidth / 2}
            y1={centerY - plateGap}
            x2={px + plateWidth / 2}
            y2={centerY - plateGap}
            stroke={strokeColor}
            strokeWidth={strokeWidth + 0.5}
          />

          {/* Lower plate (curved arc - IEC standard for capacitor) */}
          <path
            d={`M ${px - plateWidth / 2} ${centerY + plateGap} Q ${px} ${centerY + plateGap + 4} ${px + plateWidth / 2} ${centerY + plateGap}`}
            stroke={strokeColor}
            strokeWidth={strokeWidth + 0.5}
            fill={fillNone}
          />

          {/* Vertical lead from lower plate to bottom bus */}
          <line
            x1={px}
            y1={centerY + plateGap}
            x2={px}
            y2={52}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </g>
      ))}

      {/* Bottom bus bar (horizontal connection line) */}
      <line
        x1={positions[0]}
        y1={52}
        x2={positions[positions.length - 1]}
        y2={52}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Bottom connection line from bus */}
      <line
        x1={30}
        y1={52}
        x2={30}
        y2={60}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Ground symbol at bottom */}
      <line
        x1={22}
        y1={60}
        x2={38}
        y2={60}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <line
        x1={25}
        y1={63}
        x2={35}
        y2={63}
        stroke={strokeColor}
        strokeWidth={1.5}
      />
      <line
        x1={28}
        y1={66}
        x2={32}
        y2={66}
        stroke={strokeColor}
        strokeWidth={1}
      />

      {/* Label text */}
      {label && (
        <text
          x={30}
          y={69}
          fontSize={9}
          fontFamily="Arial, sans-serif"
          fontWeight="500"
          fill={labelColor}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
