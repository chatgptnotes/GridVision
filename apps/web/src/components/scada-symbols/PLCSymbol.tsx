import React from 'react';

interface PLCSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function PLCSymbol({
  width = 70,
  height = 60,
  state = 'RUNNING',
  color,
  onClick,
  label,
  className,
  rotation,
}: PLCSymbolProps) {
  const stateColor =
    color ||
    (state === 'RUNNING'
      ? '#16A34A'
      : state === 'FAULT'
        ? '#DC2626'
        : '#9CA3AF');
  const ledColor =
    state === 'RUNNING' ? '#16A34A' : state === 'FAULT' ? '#DC2626' : '#9CA3AF';
  const strokeWidth = 2;
  const labelColor = state === 'STOPPED' ? '#9CA3AF' : '#1E293B';

  // PLC body dimensions
  const rectX = 15;
  const rectY = 5;
  const rectW = 40;
  const rectH = 42;

  // I/O arrow dimensions
  const arrowLen = 8;
  const ioCount = 4;
  const ioStartY = rectY + 10;
  const ioSpacing = 8;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `PLC (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes plc-fault-keyframes {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.25; }
            }
            .plc-fault-flash {
              animation: plc-fault-keyframes 0.7s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g transform={rotation ? `rotate(${rotation} 35 30)` : undefined}>
        {/* PLC body rectangle */}
        <rect
          className={state === 'FAULT' ? 'plc-fault-flash' : undefined}
          x={rectX}
          y={rectY}
          width={rectW}
          height={rectH}
          rx={2}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* "PLC" text prominently in center */}
        <text
          x={rectX + rectW / 2}
          y={rectY + 8}
          fontSize={11}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          PLC
        </text>

        {/* Status LED in top-right corner */}
        <circle
          className={state === 'FAULT' ? 'plc-fault-flash' : undefined}
          cx={rectX + rectW - 6}
          cy={rectY + 6}
          r={2.5}
          fill={ledColor}
          stroke={ledColor}
          strokeWidth={0.5}
        />
        {/* LED glow */}
        {state === 'RUNNING' && (
          <circle
            cx={rectX + rectW - 6}
            cy={rectY + 6}
            r={4}
            fill={ledColor}
            opacity={0.2}
          />
        )}

        {/* Left side: 4 input arrows (DI) */}
        {Array.from({ length: ioCount }).map((_, i) => {
          const y = ioStartY + i * ioSpacing;
          return (
            <g key={`di-${i}`}>
              {/* Arrow line pointing right into PLC */}
              <line
                x1={rectX - arrowLen}
                y1={y}
                x2={rectX}
                y2={y}
                stroke={stateColor}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              {/* Arrowhead pointing right */}
              <polyline
                points={`${rectX - 3},${y - 2.5} ${rectX},${y} ${rectX - 3},${y + 2.5}`}
                fill="none"
                stroke={stateColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* DI label */}
              <text
                x={rectX - arrowLen - 1}
                y={y + 1}
                fontSize={5}
                fontFamily="Arial, sans-serif"
                fontWeight="500"
                fill={stateColor}
                textAnchor="end"
                dominantBaseline="middle"
              >
                DI
              </text>
              {/* Connection point */}
              <circle cx={rectX - arrowLen} cy={y} r={1.5} fill={stateColor} />
            </g>
          );
        })}

        {/* Right side: 4 output arrows (DO) */}
        {Array.from({ length: ioCount }).map((_, i) => {
          const y = ioStartY + i * ioSpacing;
          return (
            <g key={`do-${i}`}>
              {/* Arrow line pointing right out of PLC */}
              <line
                x1={rectX + rectW}
                y1={y}
                x2={rectX + rectW + arrowLen}
                y2={y}
                stroke={stateColor}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              {/* Arrowhead pointing right */}
              <polyline
                points={`${rectX + rectW + arrowLen - 3},${y - 2.5} ${rectX + rectW + arrowLen},${y} ${rectX + rectW + arrowLen - 3},${y + 2.5}`}
                fill="none"
                stroke={stateColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* DO label */}
              <text
                x={rectX + rectW + arrowLen + 1}
                y={y + 1}
                fontSize={5}
                fontFamily="Arial, sans-serif"
                fontWeight="500"
                fill={stateColor}
                textAnchor="start"
                dominantBaseline="middle"
              >
                DO
              </text>
              {/* Connection point */}
              <circle cx={rectX + rectW + arrowLen} cy={y} r={1.5} fill={stateColor} />
            </g>
          );
        })}

        {/* Divider line between header and I/O zone */}
        <line
          x1={rectX}
          y1={rectY + 14}
          x2={rectX + rectW}
          y2={rectY + 14}
          stroke={stateColor}
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.4}
        />
      </g>

      {/* Label text */}
      <text
        x={35}
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
