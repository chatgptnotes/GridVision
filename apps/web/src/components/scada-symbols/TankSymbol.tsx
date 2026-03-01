import React from 'react';

interface TankSymbolProps {
  width?: number;
  height?: number;
  state?: 'NORMAL' | 'HIGH' | 'LOW' | 'EMPTY';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function TankSymbol({
  width = 60,
  height = 70,
  state = 'NORMAL',
  color,
  onClick,
  label,
  className,
  rotation,
}: TankSymbolProps) {
  const stateColor =
    color ||
    (state === 'NORMAL'
      ? '#16A34A'
      : state === 'HIGH'
        ? '#EAB308'
        : state === 'LOW'
          ? '#F97316'
          : '#9CA3AF');

  const strokeWidth = 2;

  // Tank body dimensions
  const tankLeft = 10;
  const tankRight = 50;
  const tankTop = 8;
  const tankBottom = 52;
  const tankWidth = tankRight - tankLeft;
  const tankHeight = tankBottom - tankTop;

  // Fill level based on state
  const fillPercent =
    state === 'NORMAL'
      ? 0.5
      : state === 'HIGH'
        ? 0.8
        : state === 'LOW'
          ? 0.2
          : 0;

  const fillHeight = tankHeight * fillPercent;
  const fillTop = tankBottom - fillHeight;

  // Fill color
  const fillColor =
    state === 'NORMAL'
      ? '#16A34A'
      : state === 'HIGH'
        ? '#EAB308'
        : state === 'LOW'
          ? '#F97316'
          : '#9CA3AF';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 70"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      className={className}
      role="img"
      aria-label={label || `Tank (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tank body: rectangle with rounded top (cylinder side view) */}
      {/* Rounded top (elliptical arc) */}
      <path
        d={`M ${tankLeft} ${tankTop + 6}
            A ${tankWidth / 2} 6 0 0 1 ${tankRight} ${tankTop + 6}
            V ${tankBottom}
            H ${tankLeft}
            V ${tankTop + 6}
            Z`}
        fill="none"
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Top ellipse (dome) */}
      <ellipse
        cx={30}
        cy={tankTop + 6}
        rx={tankWidth / 2}
        ry={6}
        fill="none"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Fill level (liquid inside tank) */}
      {fillPercent > 0 && (
        <rect
          x={tankLeft + 1}
          y={fillTop}
          width={tankWidth - 2}
          height={fillHeight - 1}
          fill={fillColor}
          fillOpacity={0.25}
        />
      )}

      {/* Level line indicator */}
      {fillPercent > 0 && (
        <line
          x1={tankLeft + 1}
          y1={fillTop}
          x2={tankRight - 1}
          y2={fillTop}
          stroke={fillColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="3 2"
        />
      )}

      {/* Bottom-left inlet connection */}
      <line
        x1={0}
        y1={tankBottom}
        x2={tankLeft}
        y2={tankBottom}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Inlet terminal dot */}
      <circle cx={0} cy={tankBottom} r={3} fill={stateColor} />

      {/* Bottom-right outlet connection */}
      <line
        x1={tankRight}
        y1={tankBottom}
        x2={60}
        y2={tankBottom}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Outlet terminal dot */}
      <circle cx={60} cy={tankBottom} r={3} fill={stateColor} />

      {/* Level percentage text inside tank */}
      <text
        x={30}
        y={35}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={stateColor}
        fontSize={10}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        {`${Math.round(fillPercent * 100)}%`}
      </text>

      {/* Label */}
      <text
        x={30}
        y={66}
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
