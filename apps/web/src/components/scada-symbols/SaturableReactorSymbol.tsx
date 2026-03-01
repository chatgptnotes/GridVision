import React from 'react';

interface SaturableReactorSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SaturableReactorSymbol({
  width = 60,
  height = 80,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
  className,
  rotation,
}: SaturableReactorSymbolProps) {
  const strokeColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'ENERGIZED' ? '#1E293B' : '#9CA3AF';

  // Saturating Reactor: main coil with iron core + control winding (smaller coil below)
  const cx = 30;
  const mainCoilTop = 12;
  const mainLoopRadius = 6;
  const mainNumLoops = 3;
  const mainCoilBottom = mainCoilTop + mainNumLoops * mainLoopRadius * 2;

  // Control winding parameters
  const ctrlCoilTop = mainCoilBottom + 8;
  const ctrlLoopRadius = 5;
  const ctrlNumLoops = 2;
  const ctrlCoilBottom = ctrlCoilTop + ctrlNumLoops * ctrlLoopRadius * 2;

  // Build vertical coil path: series of half-circle arcs bulging to the left
  const buildCoilPath = (startX: number, startY: number, loopR: number, loops: number) => {
    const segments: string[] = [];
    const loopHeight = loopR * 2;

    segments.push(`M ${startX} ${startY}`);

    for (let i = 0; i < loops; i++) {
      const topY = startY + i * loopHeight;
      const bottomY = topY + loopHeight;
      segments.push(
        `A ${loopR} ${loopR} 0 0 0 ${startX} ${bottomY}`
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
      aria-label={label || `Saturable Reactor (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={mainCoilTop}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={cx} cy={0} r={3} fill={strokeColor} />

      {/* Main coil (series of half-circle arcs) */}
      <path
        d={buildCoilPath(cx, mainCoilTop, mainLoopRadius, mainNumLoops)}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill={fillNone}
      />

      {/* Iron core: two parallel vertical lines alongside the main coil */}
      <line
        x1={cx - mainLoopRadius - 4}
        y1={mainCoilTop + 2}
        x2={cx - mainLoopRadius - 4}
        y2={mainCoilBottom - 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={cx - mainLoopRadius - 8}
        y1={mainCoilTop + 2}
        x2={cx - mainLoopRadius - 8}
        y2={mainCoilBottom - 2}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Connection between main coil and control winding */}
      <line
        x1={cx}
        y1={mainCoilBottom}
        x2={cx}
        y2={ctrlCoilTop}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Control winding (smaller coil below main) */}
      <path
        d={buildCoilPath(cx, ctrlCoilTop, ctrlLoopRadius, ctrlNumLoops)}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill={fillNone}
      />

      {/* Control winding label */}
      <text
        x={cx + 14}
        y={ctrlCoilTop + ctrlNumLoops * ctrlLoopRadius}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={labelColor}
        textAnchor="start"
      >
        CTRL
      </text>

      {/* Bottom connection line */}
      <line
        x1={cx}
        y1={ctrlCoilBottom}
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
