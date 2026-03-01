import React from 'react';

interface FrequencyMeterSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function FrequencyMeterSymbol({
  width = 50,
  height = 50,
  state = 'ACTIVE',
  color,
  onClick,
  label,
}: FrequencyMeterSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;
  const cx = 25;
  const cy = 22;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Frequency Meter (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left connection line */}
      <line
        x1={0}
        y1={cy}
        x2={7}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={0} cy={cy} r={3} fill={stateColor} />

      {/* Right connection line */}
      <line
        x1={43}
        y1={cy}
        x2={50}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={50} cy={cy} r={3} fill={stateColor} />

      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={16}
        fill="#FFFFFF"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* "Hz" text */}
      <text
        x={cx}
        y={18}
        textAnchor="middle"
        fill={stateColor}
        fontSize={10}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        Hz
      </text>

      {/* Sine wave indicator */}
      <path
        d={`M 16 27 Q 19 22, 22 27 Q 25 32, 28 27 Q 31 22, 34 27`}
        fill="none"
        stroke={state === 'ACTIVE' ? '#16A34A' : '#D1D5DB'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Label below */}
      <text
        x={cx}
        y={47}
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
