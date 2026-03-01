import React from 'react';

interface HeatExchangerSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function HeatExchangerSymbol({
  width = 60,
  height = 60,
  state = 'ACTIVE',
  color,
  onClick,
  label,
  className,
  rotation,
}: HeatExchangerSymbolProps) {
  const stateColor =
    color ||
    (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');

  const strokeWidth = 2;
  const cx = 30;
  const cy = 30;
  const r = 18;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 60"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      className={className}
      role="img"
      aria-label={label || `Heat Exchanger (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left hot side connections (2 ports: in at top-left, out at bottom-left) */}
      {/* Hot in (top-left) */}
      <line
        x1={0}
        y1={20}
        x2={cx - r}
        y2={20}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={0} cy={20} r={3} fill={stateColor} />

      {/* Hot out (bottom-left) */}
      <line
        x1={0}
        y1={40}
        x2={cx - r}
        y2={40}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={0} cy={40} r={3} fill={stateColor} />

      {/* Right cold side connections (2 ports: in at top-right, out at bottom-right) */}
      {/* Cold in (top-right) */}
      <line
        x1={cx + r}
        y1={20}
        x2={60}
        y2={20}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={60} cy={20} r={3} fill={stateColor} />

      {/* Cold out (bottom-right) */}
      <line
        x1={cx + r}
        y1={40}
        x2={60}
        y2={40}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={60} cy={40} r={3} fill={stateColor} />

      {/* Main circle (shell) */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Crossing arrows inside (shell-and-tube representation) */}
      {/* Arrow 1: top-left to bottom-right (hot flow) */}
      <line
        x1={cx - 10}
        y1={cy - 10}
        x2={cx + 10}
        y2={cy + 10}
        stroke={state === 'ACTIVE' ? '#DC2626' : stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Arrowhead for hot flow */}
      <polygon
        points={`${cx + 10},${cy + 10} ${cx + 5},${cy + 6} ${cx + 6},${cy + 11}`}
        fill={state === 'ACTIVE' ? '#DC2626' : stateColor}
      />

      {/* Arrow 2: bottom-left to top-right (cold flow) */}
      <line
        x1={cx - 10}
        y1={cy + 10}
        x2={cx + 10}
        y2={cy - 10}
        stroke={state === 'ACTIVE' ? '#1E40AF' : stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Arrowhead for cold flow */}
      <polygon
        points={`${cx + 10},${cy - 10} ${cx + 5},${cy - 6} ${cx + 6},${cy - 11}`}
        fill={state === 'ACTIVE' ? '#1E40AF' : stateColor}
      />

      {/* "H" label (hot side, left) */}
      <text
        x={cx - 10}
        y={cy - 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={state === 'ACTIVE' ? '#DC2626' : stateColor}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        H
      </text>

      {/* "C" label (cold side, right) */}
      <text
        x={cx + 10}
        y={cy + 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={state === 'ACTIVE' ? '#1E40AF' : stateColor}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        C
      </text>

      {/* Label */}
      <text
        x={cx}
        y={56}
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
