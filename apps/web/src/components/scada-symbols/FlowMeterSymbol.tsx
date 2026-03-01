import React from 'react';

interface FlowMeterSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function FlowMeterSymbol({
  width = 50,
  height = 50,
  state = 'ACTIVE',
  color,
  onClick,
  label,
  className,
  rotation,
}: FlowMeterSymbolProps) {
  const stateColor =
    color ||
    (state === 'ACTIVE' ? '#16A34A' : '#9CA3AF');

  const strokeWidth = 2;
  const cx = 25;
  const cy = 22;
  const r = 14;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      className={className}
      role="img"
      aria-label={label || `Flow Meter (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left connection line */}
      <line
        x1={0}
        y1={cy}
        x2={cx - r}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Left terminal dot */}
      <circle cx={0} cy={cy} r={3} fill={stateColor} />

      {/* Right connection line */}
      <line
        x1={cx + r}
        y1={cy}
        x2={50}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Right terminal dot */}
      <circle cx={50} cy={cy} r={3} fill={stateColor} />

      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Horizontal line through center */}
      <line
        x1={cx - r}
        y1={cy}
        x2={cx + r}
        y2={cy}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
      />

      {/* Flow arrow indicator on the line (pointing right) */}
      <polygon
        points={`${cx + 5},${cy - 3} ${cx + 10},${cy} ${cx + 5},${cy + 3}`}
        fill={stateColor}
      />

      {/* "F" text inside (above line) */}
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={stateColor}
        fontSize={12}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        F
      </text>

      {/* Label */}
      <text
        x={cx}
        y={46}
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
