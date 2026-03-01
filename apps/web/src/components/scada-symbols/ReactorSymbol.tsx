import React from 'react';

interface ReactorSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function ReactorSymbol({
  width = 50,
  height = 70,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
}: ReactorSymbolProps) {
  const strokeColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'ENERGIZED' ? '#1E293B' : '#9CA3AF';

  // Reactor/inductor: series of half-circle arcs (coil loops)
  // IEC standard representation - vertical coil with 4 humps
  const cx = 25;
  const coilTop = 16;
  const loopRadius = 7;
  const numLoops = 4;

  // Build the coil path: a series of half-circle arcs going left
  // Each arc sweeps from top to bottom of each loop segment
  const buildCoilPath = () => {
    const segments: string[] = [];
    const loopHeight = loopRadius * 2;
    const startY = coilTop;

    // Move to start point
    segments.push(`M ${cx} ${startY}`);

    for (let i = 0; i < numLoops; i++) {
      const topY = startY + i * loopHeight;
      const bottomY = topY + loopHeight;
      // Half-circle arc bulging to the left
      segments.push(
        `A ${loopRadius} ${loopRadius} 0 0 0 ${cx} ${bottomY}`
      );
    }

    return segments.join(' ');
  };

  const coilBottom = coilTop + numLoops * loopRadius * 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Reactor (${state})`}
    >
      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={coilTop}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Coil (series of half-circle arcs) */}
      <path
        d={buildCoilPath()}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fillNone}
      />

      {/* Bottom connection line */}
      <line
        x1={cx}
        y1={coilBottom}
        x2={cx}
        y2={60}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Iron core indication lines (two vertical lines beside the coil) */}
      {state === 'ENERGIZED' && (
        <>
          <line
            x1={cx - loopRadius - 3}
            y1={coilTop + 2}
            x2={cx - loopRadius - 3}
            y2={coilBottom - 2}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
          <line
            x1={cx - loopRadius - 6}
            y1={coilTop + 2}
            x2={cx - loopRadius - 6}
            y2={coilBottom - 2}
            stroke={strokeColor}
            strokeWidth={1.5}
          />
        </>
      )}

      {/* Label text */}
      {label && (
        <text
          x={cx}
          y={68}
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
