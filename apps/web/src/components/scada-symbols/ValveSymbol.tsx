import React from 'react';

interface ValveSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED' | 'THROTTLED' | 'FAULT';
  variant?: 'gate' | 'globe' | 'ball';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function ValveSymbol({
  width = 50,
  height = 50,
  state = 'OPEN',
  variant = 'gate',
  color,
  onClick,
  label,
  className,
  rotation,
}: ValveSymbolProps) {
  const stateColor =
    color ||
    (state === 'OPEN'
      ? '#16A34A'
      : state === 'CLOSED'
        ? '#DC2626'
        : state === 'THROTTLED'
          ? '#EAB308'
          : '#DC2626');

  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
      className={className}
      role="img"
      aria-label={label || `${variant} Valve (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-valve {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.2; }
            }
            .valve-fault-flash {
              animation: fault-flash-valve 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      <g className={state === 'FAULT' ? 'valve-fault-flash' : undefined}>
        {/* Left connection line */}
        <line
          x1={0}
          y1={25}
          x2={13}
          y2={25}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Left terminal dot */}
        <circle cx={0} cy={25} r={3} fill={stateColor} />

        {/* Right connection line */}
        <line
          x1={37}
          y1={25}
          x2={50}
          y2={25}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Right terminal dot */}
        <circle cx={50} cy={25} r={3} fill={stateColor} />

        {/* Gate Valve: bowtie shape (two triangles meeting at center) */}
        {variant === 'gate' && (
          <>
            {/* Left triangle (points right) */}
            <polygon
              points="13,15 25,25 13,35"
              fill={state === 'CLOSED' ? stateColor : 'none'}
              fillOpacity={state === 'CLOSED' ? 0.2 : 0}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Right triangle (points left) */}
            <polygon
              points="37,15 25,25 37,35"
              fill={state === 'CLOSED' ? stateColor : 'none'}
              fillOpacity={state === 'CLOSED' ? 0.2 : 0}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Stem line (vertical) */}
            <line
              x1={25}
              y1={15}
              x2={25}
              y2={8}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Handwheel */}
            <line
              x1={20}
              y1={8}
              x2={30}
              y2={8}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Throttled indicator: partial fill line */}
            {state === 'THROTTLED' && (
              <line
                x1={25}
                y1={20}
                x2={25}
                y2={30}
                stroke={stateColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="2 2"
              />
            )}
          </>
        )}

        {/* Globe Valve: bowtie with circle in center */}
        {variant === 'globe' && (
          <>
            {/* Left triangle */}
            <polygon
              points="13,15 25,25 13,35"
              fill={state === 'CLOSED' ? stateColor : 'none'}
              fillOpacity={state === 'CLOSED' ? 0.2 : 0}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Right triangle */}
            <polygon
              points="37,15 25,25 37,35"
              fill={state === 'CLOSED' ? stateColor : 'none'}
              fillOpacity={state === 'CLOSED' ? 0.2 : 0}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Globe circle at center */}
            <circle
              cx={25}
              cy={25}
              r={5}
              fill={state === 'CLOSED' ? stateColor : 'none'}
              fillOpacity={state === 'CLOSED' ? 0.3 : 0}
              stroke={stateColor}
              strokeWidth={strokeWidth}
            />
            {/* Stem line */}
            <line
              x1={25}
              y1={15}
              x2={25}
              y2={8}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Handwheel */}
            <line
              x1={20}
              y1={8}
              x2={30}
              y2={8}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Ball Valve: circle with through-hole */}
        {variant === 'ball' && (
          <>
            {/* Ball circle */}
            <circle
              cx={25}
              cy={25}
              r={10}
              fill={state === 'CLOSED' ? stateColor : 'none'}
              fillOpacity={state === 'CLOSED' ? 0.15 : 0}
              stroke={stateColor}
              strokeWidth={strokeWidth}
            />
            {/* Through-hole line (horizontal when open, vertical when closed) */}
            {state === 'OPEN' && (
              <line
                x1={15}
                y1={25}
                x2={35}
                y2={25}
                stroke={stateColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )}
            {state === 'CLOSED' && (
              <line
                x1={25}
                y1={15}
                x2={25}
                y2={35}
                stroke={stateColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )}
            {state === 'THROTTLED' && (
              <line
                x1={18}
                y1={20}
                x2={32}
                y2={30}
                stroke={stateColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )}
            {state === 'FAULT' && (
              <line
                x1={25}
                y1={15}
                x2={25}
                y2={35}
                stroke={stateColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )}
            {/* Stem line */}
            <line
              x1={25}
              y1={15}
              x2={25}
              y2={8}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Handle */}
            <line
              x1={20}
              y1={8}
              x2={30}
              y2={8}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        )}
      </g>

      {/* Label */}
      <text
        x={25}
        y={46}
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
