import React from 'react';

interface ZigZagTransformerSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function ZigZagTransformerSymbol({
  width = 60,
  height = 90,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
  className,
  rotation,
}: ZigZagTransformerSymbolProps) {
  const strokeColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'ENERGIZED' ? '#1E293B' : '#9CA3AF';

  const cx = 30;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 90"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Zig-Zag Transformer (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={12}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={cx} cy={0} r={3} fill={strokeColor} />

      {/* First zig-zag winding set (upper) */}
      <polyline
        points="30,12 20,20 40,28 20,36 40,44 30,48"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillNone}
      />

      {/* Second zig-zag winding set (lower) - connected, phase-shifted */}
      <polyline
        points="30,48 40,52 20,60 40,68 30,72"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillNone}
      />

      {/* Connection between winding sets (center point marker) */}
      <circle cx={cx} cy={48} r={2} fill={strokeColor} />

      {/* Bottom connection line to ground */}
      <line
        x1={cx}
        y1={72}
        x2={cx}
        y2={76}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Ground symbol at bottom */}
      <line
        x1={21}
        y1={76}
        x2={39}
        y2={76}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={24}
        y1={79}
        x2={36}
        y2={79}
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={27}
        y1={82}
        x2={33}
        y2={82}
        stroke={strokeColor}
        strokeWidth={1}
        strokeLinecap="round"
      />

      {/* Label text at bottom */}
      <text
        x={cx}
        y={88}
        fontSize={9}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
        fill={labelColor}
        textAnchor="middle"
      >
        {label || state}
      </text>
    </svg>
  );
}
