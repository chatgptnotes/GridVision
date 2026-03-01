import React from 'react';

interface ShuntReactorSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function ShuntReactorSymbol({
  width = 60,
  height = 80,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
  className,
  rotation,
}: ShuntReactorSymbolProps) {
  const strokeColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'ENERGIZED' ? '#1E293B' : '#9CA3AF';

  // Shunt Reactor (IEC): coil/inductor symbol with iron core (two parallel lines)
  const cx = 30;
  const coilTop = 16;
  const loopRadius = 7;
  const numLoops = 4;
  const coilBottom = coilTop + numLoops * loopRadius * 2;

  // Build coil path: series of half-circle arcs bulging to the left
  const buildCoilPath = () => {
    const segments: string[] = [];
    const loopHeight = loopRadius * 2;

    segments.push(`M ${cx} ${coilTop}`);

    for (let i = 0; i < numLoops; i++) {
      const topY = coilTop + i * loopHeight;
      const bottomY = topY + loopHeight;
      segments.push(
        `A ${loopRadius} ${loopRadius} 0 0 0 ${cx} ${bottomY}`
      );
    }

    return segments.join(' ');
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Shunt Reactor (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={coilTop}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={cx} cy={0} r={3} fill={strokeColor} />

      {/* Coil (series of half-circle arcs) */}
      <path
        d={buildCoilPath()}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill={fillNone}
      />

      {/* Iron core: two parallel vertical lines alongside the coil (left side) */}
      <line
        x1={cx - loopRadius - 4}
        y1={coilTop + 2}
        x2={cx - loopRadius - 4}
        y2={coilBottom - 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={cx - loopRadius - 8}
        y1={coilTop + 2}
        x2={cx - loopRadius - 8}
        y2={coilBottom - 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom connection line */}
      <line
        x1={cx}
        y1={coilBottom}
        x2={cx}
        y2={66}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={cx} cy={66} r={3} fill={strokeColor} />

      {/* Label text at bottom */}
      <text
        x={cx}
        y={77}
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
