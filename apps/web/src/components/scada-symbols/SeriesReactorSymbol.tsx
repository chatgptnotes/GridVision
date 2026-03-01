import React from 'react';

interface SeriesReactorSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SeriesReactorSymbol({
  width = 60,
  height = 60,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
  className,
  rotation,
}: SeriesReactorSymbolProps) {
  const strokeColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'ENERGIZED' ? '#1E293B' : '#9CA3AF';

  // Series/Current Limiting Reactor: horizontal coil zigzag symbol, air core (no parallel lines)
  const cy = 25;
  const loopRadius = 6;
  const numLoops = 4;
  const coilLeft = 10;
  const coilRight = coilLeft + numLoops * loopRadius * 2;

  // Build horizontal coil path: series of half-circle arcs bulging upward
  const buildCoilPath = () => {
    const segments: string[] = [];
    const loopWidth = loopRadius * 2;

    segments.push(`M ${coilLeft} ${cy}`);

    for (let i = 0; i < numLoops; i++) {
      const leftX = coilLeft + i * loopWidth;
      const rightX = leftX + loopWidth;
      // Half-circle arc bulging upward
      segments.push(
        `A ${loopRadius} ${loopRadius} 0 0 1 ${rightX} ${cy}`
      );
    }

    return segments.join(' ');
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Series Reactor (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left connection line */}
      <line
        x1={0}
        y1={cy}
        x2={coilLeft}
        y2={cy}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Left terminal dot */}
      <circle cx={0} cy={cy} r={3} fill={strokeColor} />

      {/* Coil (series of half-circle arcs, horizontal, air core) */}
      <path
        d={buildCoilPath()}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill={fillNone}
      />

      {/* Right connection line */}
      <line
        x1={coilRight}
        y1={cy}
        x2={60}
        y2={cy}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Right terminal dot */}
      <circle cx={60} cy={cy} r={3} fill={strokeColor} />

      {/* Label text at bottom */}
      <text
        x={30}
        y={55}
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
