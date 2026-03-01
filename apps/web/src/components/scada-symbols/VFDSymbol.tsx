import React from 'react';

interface VFDSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function VFDSymbol({
  width = 80,
  height = 80,
  state = 'STOPPED',
  color,
  onClick,
  label,
  className,
  rotation,
}: VFDSymbolProps) {
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

  // VFD rectangle dimensions
  const rectX = 5;
  const rectY = 15;
  const rectW = 35;
  const rectH = 40;
  const rectCx = rectX + rectW / 2;
  const rectCy = rectY + rectH / 2;

  // Motor circle
  const motorCx = 62;
  const motorCy = 35;
  const motorR = 14;

  // Frequency wave inside VFD rect when RUNNING
  const freqWavePath = [
    'M', rectCx - 10, rectCy + 10,
    'Q', rectCx - 5, rectCy + 4, rectCx, rectCy + 10,
    'Q', rectCx + 5, rectCy + 16, rectCx + 10, rectCy + 10,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Variable Frequency Drive (${state})`}
      className={className}
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes vfd-fault-anim {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .vfd-fault-flash {
              animation: vfd-fault-anim 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g transform={rotation ? `rotate(${rotation} 40 40)` : undefined}>
        {/* Left input connection line */}
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

        {/* VFD Rectangle */}
        <rect
          className={state === 'FAULT' ? 'vfd-fault-flash' : undefined}
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

        {/* "VFD" text in rectangle */}
        <text
          x={rectCx}
          y={rectCy - 2}
          fontSize={11}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          VFD
        </text>

        {/* Frequency wave indicator in rectangle when RUNNING */}
        <path
          d={freqWavePath}
          stroke={stateColor}
          strokeWidth={1.5}
          fill={fillNone}
          strokeLinecap="round"
          opacity={state === 'RUNNING' ? 1 : 0.25}
        />

        {/* Connection line from VFD to motor */}
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
          className={state === 'FAULT' ? 'vfd-fault-flash' : undefined}
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
          fontSize={12}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          M
        </text>

        {/* Bottom connection line from VFD */}
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
        x={40}
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
