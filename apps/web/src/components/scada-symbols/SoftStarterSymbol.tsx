import React from 'react';

interface SoftStarterSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SoftStarterSymbol({
  width = 70,
  height = 80,
  state = 'STOPPED',
  color,
  onClick,
  label,
  className,
  rotation,
}: SoftStarterSymbolProps) {
  const stateColor =
    color ||
    (state === 'RUNNING'
      ? '#16A34A'
      : state === 'FAULT'
        ? '#DC2626'
        : '#9CA3AF');

  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'STOPPED' ? '#9CA3AF' : '#1E293B';

  // Soft Starter rectangle dimensions
  const rectX = 5;
  const rectY = 15;
  const rectW = 32;
  const rectH = 40;
  const rectCx = rectX + rectW / 2;
  const rectCy = rectY + rectH / 2;

  // Motor circle on the right
  const motorCx = 55;
  const motorCy = 35;
  const motorR = 12;

  // Ramping arrow: diagonal line going up-right inside the rectangle
  const rampStartX = rectCx - 8;
  const rampStartY = rectCy + 10;
  const rampEndX = rectCx + 8;
  const rampEndY = rectCy - 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Soft Starter (${state})`}
      className={className}
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes soft-starter-fault-anim {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .soft-starter-fault-flash {
              animation: soft-starter-fault-anim 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g transform={rotation ? `rotate(${rotation} 35 40)` : undefined}>
        {/* Top connection line (input to soft starter) */}
        <line
          x1={rectCx}
          y1={0}
          x2={rectCx}
          y2={rectY}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Top terminal dot */}
        <circle cx={rectCx} cy={0} r={3} fill={stateColor} />

        {/* Soft Starter rectangle */}
        <rect
          className={state === 'FAULT' ? 'soft-starter-fault-flash' : undefined}
          x={rectX}
          y={rectY}
          width={rectW}
          height={rectH}
          rx={3}
          ry={3}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          fill={fillNone}
          strokeLinecap="round"
        />

        {/* "SS" text in rectangle */}
        <text
          x={rectCx}
          y={rectCy - 7}
          fontSize={12}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          SS
        </text>

        {/* Ramping arrow symbol (diagonal line going up) */}
        <line
          x1={rampStartX}
          y1={rampStartY}
          x2={rampEndX}
          y2={rampEndY}
          stroke={stateColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Arrowhead at the top of the ramp */}
        <polyline
          points={`${rampEndX - 4},${rampEndY - 1} ${rampEndX},${rampEndY} ${rampEndX - 1},${rampEndY + 4}`}
          stroke={stateColor}
          strokeWidth={1.5}
          fill={fillNone}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Connection line from soft starter to motor */}
        <line
          x1={rectX + rectW}
          y1={motorCy}
          x2={motorCx - motorR}
          y2={motorCy}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Motor circle */}
        <circle
          className={state === 'FAULT' ? 'soft-starter-fault-flash' : undefined}
          cx={motorCx}
          cy={motorCy}
          r={motorR}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          fill={fillNone}
          strokeLinecap="round"
        />

        {/* "M" text in motor circle */}
        <text
          x={motorCx}
          y={motorCy + 1}
          fontSize={11}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          M
        </text>

        {/* Right terminal dot on motor */}
        <line
          x1={motorCx + motorR}
          y1={motorCy}
          x2={motorCx + motorR + 5}
          y2={motorCy}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <circle cx={motorCx + motorR + 5} cy={motorCy} r={3} fill={stateColor} />

        {/* Bottom connection line from soft starter */}
        <line
          x1={rectCx}
          y1={rectY + rectH}
          x2={rectCx}
          y2={65}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Bottom terminal dot */}
        <circle cx={rectCx} cy={65} r={3} fill={stateColor} />
      </g>

      {/* Label text */}
      <text
        x={35}
        y={76}
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
