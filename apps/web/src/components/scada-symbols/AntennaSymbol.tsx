import React from 'react';

interface AntennaSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function AntennaSymbol({
  width = 40,
  height = 50,
  state = 'ACTIVE',
  color,
  onClick,
  label,
  className,
  rotation,
}: AntennaSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;
  const labelColor = state === 'INACTIVE' ? '#9CA3AF' : '#1E293B';

  // Antenna rod
  const rodX = 20;
  const rodTopY = 8;
  const rodBottomY = 34;

  // Base/mount
  const baseY = 34;
  const baseW = 16;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Antenna/Wireless Link (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pulse animation for active state */}
      {state === 'ACTIVE' && (
        <style>
          {`
            @keyframes antenna-pulse-keyframes {
              0% { opacity: 0.8; transform: scale(1); }
              50% { opacity: 0.3; transform: scale(1.05); }
              100% { opacity: 0.8; transform: scale(1); }
            }
            .antenna-pulse {
              animation: antenna-pulse-keyframes 1.5s ease-in-out infinite;
              transform-origin: 20px 8px;
            }
          `}
        </style>
      )}

      <g transform={rotation ? `rotate(${rotation} 20 25)` : undefined}>
        {/* Three concentric arc waves radiating from top (WiFi/radio symbol) */}
        {/* Innermost arc (smallest) */}
        <path
          className={state === 'ACTIVE' ? 'antenna-pulse' : undefined}
          d="M 15,10 A 6,6 0 0,1 25,10"
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={state === 'ACTIVE' ? 0.9 : 0.4}
        />

        {/* Middle arc */}
        <path
          className={state === 'ACTIVE' ? 'antenna-pulse' : undefined}
          d="M 12,8 A 10,10 0 0,1 28,8"
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={state === 'ACTIVE' ? 0.65 : 0.3}
          style={state === 'ACTIVE' ? { animationDelay: '0.3s' } : undefined}
        />

        {/* Outermost arc (largest) */}
        <path
          className={state === 'ACTIVE' ? 'antenna-pulse' : undefined}
          d="M 9,6 A 14,14 0 0,1 31,6"
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={state === 'ACTIVE' ? 0.4 : 0.2}
          style={state === 'ACTIVE' ? { animationDelay: '0.6s' } : undefined}
        />

        {/* Antenna rod (vertical line at center) */}
        <line
          x1={rodX}
          y1={rodTopY}
          x2={rodX}
          y2={rodBottomY}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Antenna tip dot */}
        <circle
          cx={rodX}
          cy={rodTopY}
          r={2}
          fill={stateColor}
        />

        {/* Base/mount at bottom (trapezoid shape) */}
        <polygon
          points={`${rodX - baseW / 2},${baseY + 6} ${rodX - 3},${baseY} ${rodX + 3},${baseY} ${rodX + baseW / 2},${baseY + 6}`}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ground/mounting line */}
        <line
          x1={rodX - baseW / 2 - 2}
          y1={baseY + 6}
          x2={rodX + baseW / 2 + 2}
          y2={baseY + 6}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Connection point at base */}
        <circle cx={rodX} cy={baseY + 6} r={2} fill={stateColor} />
      </g>

      {/* Label text */}
      <text
        x={20}
        y={47}
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
