import React from 'react';

interface EnclosureSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function EnclosureSymbol({
  width = 80,
  height = 60,
  state = 'ACTIVE',
  color,
  onClick,
  label,
  className,
  rotation,
}: EnclosureSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;
  const labelColor = state === 'INACTIVE' ? '#9CA3AF' : '#1E293B';

  // Outer enclosure dimensions
  const outerX = 4;
  const outerY = 6;
  const outerW = 72;
  const outerH = 42;

  // Inner equipment zone dimensions
  const innerX = 12;
  const innerY = 14;
  const innerW = 56;
  const innerH = 28;

  // Door position (left side)
  const doorGapY = outerY + 14;
  const doorGapH = 14;
  const doorArcR = 5;

  // Ventilation slots position (top)
  const ventCount = 5;
  const ventStartX = outerX + 16;
  const ventSpacing = 10;
  const ventY = outerY + 3;
  const ventLen = 6;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Equipment Enclosure (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={rotation ? `rotate(${rotation} 40 30)` : undefined}>
        {/* Outer enclosure rectangle (thick border = enclosure wall) */}
        <rect
          x={outerX}
          y={outerY}
          width={outerW}
          height={outerH}
          rx={2}
          fill="none"
          stroke={stateColor}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Ventilation slots on top (horizontal lines) */}
        {Array.from({ length: ventCount }).map((_, i) => {
          const slotX = ventStartX + i * ventSpacing;
          return (
            <line
              key={`vent-${i}`}
              x1={slotX}
              y1={ventY}
              x2={slotX + ventLen}
              y2={ventY}
              stroke={stateColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.6}
            />
          );
        })}

        {/* Inner dashed rectangle (equipment zone) */}
        <rect
          x={innerX}
          y={innerY}
          width={innerW}
          height={innerH}
          rx={1}
          fill="none"
          stroke={stateColor}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="4,3"
          opacity={0.6}
        />

        {/* Door symbol on left side (gap in outer wall with arc) */}
        {/* Door gap - overlay to "break" the outer wall */}
        <line
          x1={outerX}
          y1={doorGapY}
          x2={outerX}
          y2={doorGapY + doorGapH}
          stroke="white"
          strokeWidth={4}
          strokeLinecap="butt"
        />
        {/* Door gap redraw thin lines at gap edges */}
        <line
          x1={outerX - 0.5}
          y1={doorGapY}
          x2={outerX + 1}
          y2={doorGapY}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1={outerX - 0.5}
          y1={doorGapY + doorGapH}
          x2={outerX + 1}
          y2={doorGapY + doorGapH}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Door swing arc */}
        <path
          d={`M ${outerX},${doorGapY} A ${doorArcR},${doorArcR} 0 0,0 ${outerX - doorArcR},${doorGapY + doorArcR}`}
          fill="none"
          stroke={stateColor}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="2,2"
          opacity={0.5}
        />

        {/* Equipment zone interior marker lines (indicate equipment placement) */}
        <line
          x1={innerX + 8}
          y1={innerY + 6}
          x2={innerX + 8}
          y2={innerY + innerH - 6}
          stroke={stateColor}
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.25}
        />
        <line
          x1={innerX + innerW - 8}
          y1={innerY + 6}
          x2={innerX + innerW - 8}
          y2={innerY + innerH - 6}
          stroke={stateColor}
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.25}
        />

        {/* Status indicator - small dot in top-right */}
        <circle
          cx={outerX + outerW - 8}
          cy={outerY + 8}
          r={2.5}
          fill={state === 'ACTIVE' ? '#16A34A' : '#9CA3AF'}
          stroke={state === 'ACTIVE' ? '#16A34A' : '#9CA3AF'}
          strokeWidth={0.5}
        />

        {/* Connection points */}
        <circle cx={outerX + outerW / 2} cy={outerY} r={2} fill={stateColor} />
        <circle cx={outerX + outerW / 2} cy={outerY + outerH} r={2} fill={stateColor} />
        <circle cx={outerX + outerW} cy={outerY + outerH / 2} r={2} fill={stateColor} />
      </g>

      {/* Label text */}
      <text
        x={40}
        y={56}
        fontSize={8}
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
