import React from 'react';

interface AutoTransformerSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function AutoTransformerSymbol({
  width = 60,
  height = 90,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
  className,
  rotation,
}: AutoTransformerSymbolProps) {
  const strokeColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'ENERGIZED' ? '#1E293B' : '#9CA3AF';

  // Auto transformer: single coil circle with a tap point on the right side
  // IEC representation - one circle (not two overlapping like regular transformer)
  const cx = 30;
  const coilCy = 40;
  const coilR = 16;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 90"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Auto Transformer (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {rotation !== undefined && (
        <g transform={`rotate(${rotation} 30 45)`} />
      )}

      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={coilCy - coilR}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={cx} cy={0} r={3} fill={strokeColor} />

      {/* Single coil circle (auto transformer has one winding) */}
      <circle
        cx={cx}
        cy={coilCy}
        r={coilR}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fillNone}
      />

      {/* Tap connection line from right side of coil to terminal */}
      <line
        x1={cx + coilR}
        y1={coilCy}
        x2={56}
        y2={coilCy}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Tap arrow pointing to winding (arrowhead on left end) */}
      <polyline
        points={`${cx + coilR + 6},${coilCy - 4} ${cx + coilR},${coilCy} ${cx + coilR + 6},${coilCy + 4}`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill={fillNone}
      />

      {/* Tap terminal dot */}
      <circle cx={56} cy={coilCy} r={3} fill={strokeColor} />

      {/* Polarity dot */}
      <circle cx={cx - 10} cy={coilCy - 10} r={2} fill={strokeColor} />

      {/* Bottom connection line */}
      <line
        x1={cx}
        y1={coilCy + coilR}
        x2={cx}
        y2={75}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={cx} cy={75} r={3} fill={strokeColor} />

      {/* Label text at bottom */}
      <text
        x={cx}
        y={87}
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
