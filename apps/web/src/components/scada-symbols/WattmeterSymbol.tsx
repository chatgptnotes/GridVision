import React from 'react';

interface WattmeterSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function WattmeterSymbol({
  width = 50,
  height = 50,
  state = 'ACTIVE',
  color,
  onClick,
  label,
}: WattmeterSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;
  const cx = 25;
  const cy = 20;
  const radius = 14;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Wattmeter (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#FFFFFF"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* "W" text inside (bold) */}
      <text
        x={cx}
        y={25}
        textAnchor="middle"
        fill={stateColor}
        fontSize={15}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        W
      </text>

      {/* Current pair: left and right horizontal connections */}
      {/* Left current connection */}
      <line
        x1={0}
        y1={cy}
        x2={cx - radius}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={0} cy={cy} r={3} fill={stateColor} />

      {/* Right current connection */}
      <line
        x1={cx + radius}
        y1={cy}
        x2={50}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={50} cy={cy} r={3} fill={stateColor} />

      {/* Voltage pair: two connections going down from bottom of circle */}
      {/* Bottom-left voltage connection */}
      <line
        x1={19}
        y1={cy + radius}
        x2={19}
        y2={41}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={19} cy={41} r={3} fill={stateColor} />

      {/* Bottom-right voltage connection */}
      <line
        x1={31}
        y1={cy + radius}
        x2={31}
        y2={41}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={31} cy={41} r={3} fill={stateColor} />

      {/* "I" label near left current terminal */}
      <text
        x={5}
        y={cy - 4}
        textAnchor="middle"
        fill={stateColor}
        fontSize={4}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        I
      </text>

      {/* "V" label between voltage terminals */}
      <text
        x={cx}
        y={40}
        textAnchor="middle"
        fill={stateColor}
        fontSize={4}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        V
      </text>

      {/* Label below */}
      <text
        x={cx}
        y={49}
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
