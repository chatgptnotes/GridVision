import React from 'react';

interface CommunicationSymbolProps {
  width?: number;
  height?: number;
  state?: 'CONNECTED' | 'DISCONNECTED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function CommunicationSymbol({
  width = 80,
  height = 30,
  state = 'CONNECTED',
  color,
  onClick,
  label,
  className,
  rotation,
}: CommunicationSymbolProps) {
  const stateColor =
    color ||
    (state === 'CONNECTED'
      ? '#16A34A'
      : state === 'FAULT'
        ? '#DC2626'
        : '#9CA3AF');
  const strokeWidth = 2;
  const labelColor = state === 'DISCONNECTED' ? '#9CA3AF' : '#1E293B';

  // Device rectangles at ends
  const devW = 10;
  const devH = 14;
  const devY = 3;
  const leftDevX = 3;
  const rightDevX = 67;

  // Line Y center
  const lineY = devY + devH / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 30"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Communication Link (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes comm-fault-keyframes {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.2; }
            }
            .comm-fault-flash {
              animation: comm-fault-keyframes 0.6s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g transform={rotation ? `rotate(${rotation} 40 15)` : undefined}>
        {/* Left device rectangle */}
        <rect
          x={leftDevX}
          y={devY}
          width={devW}
          height={devH}
          rx={1.5}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Left device internal indicator */}
        <circle
          cx={leftDevX + devW / 2}
          cy={devY + devH / 2}
          r={2}
          fill={stateColor}
          opacity={0.5}
        />

        {/* Left horizontal line segment (device to zigzag) */}
        <line
          x1={leftDevX + devW}
          y1={lineY}
          x2={28}
          y2={lineY}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={state === 'FAULT' ? 'comm-fault-flash' : undefined}
        />

        {/* Zigzag / lightning bolt in the middle (representing data) */}
        <polyline
          className={state === 'FAULT' ? 'comm-fault-flash' : undefined}
          points={`28,${lineY} 33,${lineY - 5} 37,${lineY + 5} 40,${lineY - 5} 43,${lineY + 5} 47,${lineY - 5} 52,${lineY}`}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={state === 'DISCONNECTED' ? 0.4 : 1}
        />

        {/* Disconnected gap indicator */}
        {state === 'DISCONNECTED' && (
          <g>
            <line
              x1={38}
              y1={lineY - 7}
              x2={42}
              y2={lineY + 7}
              stroke="#DC2626"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Right horizontal line segment (zigzag to device) */}
        <line
          x1={52}
          y1={lineY}
          x2={rightDevX}
          y2={lineY}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={state === 'FAULT' ? 'comm-fault-flash' : undefined}
        />

        {/* Right device rectangle */}
        <rect
          x={rightDevX}
          y={devY}
          width={devW}
          height={devH}
          rx={1.5}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Right device internal indicator */}
        <circle
          cx={rightDevX + devW / 2}
          cy={devY + devH / 2}
          r={2}
          fill={stateColor}
          opacity={0.5}
        />

        {/* Connection points */}
        <circle cx={leftDevX} cy={lineY} r={2} fill={stateColor} />
        <circle cx={rightDevX + devW} cy={lineY} r={2} fill={stateColor} />
      </g>

      {/* Label text */}
      <text
        x={40}
        y={27}
        fontSize={7}
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
