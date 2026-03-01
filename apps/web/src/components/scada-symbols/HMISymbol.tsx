import React from 'react';

interface HMISymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function HMISymbol({
  width = 70,
  height = 50,
  state = 'ACTIVE',
  color,
  onClick,
  label,
  className,
  rotation,
}: HMISymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const screenGlow = state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF';
  const strokeWidth = 2;
  const labelColor = state === 'INACTIVE' ? '#9CA3AF' : '#1E293B';

  // Display body dimensions
  const bodyX = 5;
  const bodyY = 3;
  const bodyW = 60;
  const bodyH = 32;

  // Screen area (inner rectangle)
  const screenX = 9;
  const screenY = 6;
  const screenW = 52;
  const screenH = 22;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `HMI Operator Panel (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={rotation ? `rotate(${rotation} 35 25)` : undefined}>
        {/* Blue glow behind screen when ACTIVE */}
        {state === 'ACTIVE' && (
          <rect
            x={screenX - 2}
            y={screenY - 2}
            width={screenW + 4}
            height={screenH + 4}
            rx={3}
            fill={screenGlow}
            opacity={0.12}
          />
        )}

        {/* Display body (outer rectangle - touchscreen housing) */}
        <rect
          x={bodyX}
          y={bodyY}
          width={bodyW}
          height={bodyH}
          rx={3}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Screen area (inner rectangle) */}
        <rect
          x={screenX}
          y={screenY}
          width={screenW}
          height={screenH}
          rx={2}
          fill={state === 'ACTIVE' ? screenGlow : '#E5E7EB'}
          fillOpacity={state === 'ACTIVE' ? 0.08 : 0.3}
          stroke={stateColor}
          strokeWidth={1.2}
          strokeLinecap="round"
        />

        {/* Simple graph/wave indicator inside screen */}
        <polyline
          points={`${screenX + 4},${screenY + 14} ${screenX + 10},${screenY + 8} ${screenX + 17},${screenY + 16} ${screenX + 23},${screenY + 6} ${screenX + 30},${screenY + 12} ${screenX + 36},${screenY + 5} ${screenX + 42},${screenY + 11} ${screenX + 48},${screenY + 8}`}
          fill="none"
          stroke={stateColor}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={state === 'ACTIVE' ? 0.8 : 0.3}
        />

        {/* Horizontal baseline in screen */}
        <line
          x1={screenX + 3}
          y1={screenY + screenH - 3}
          x2={screenX + screenW - 3}
          y2={screenY + screenH - 3}
          stroke={stateColor}
          strokeWidth={0.6}
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Stand / base below display */}
        <line
          x1={35}
          y1={bodyY + bodyH}
          x2={35}
          y2={bodyY + bodyH + 4}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1={25}
          y1={bodyY + bodyH + 4}
          x2={45}
          y2={bodyY + bodyH + 4}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Connection points (left and right of body) */}
        <circle cx={bodyX} cy={bodyY + bodyH / 2} r={2} fill={stateColor} />
        <circle cx={bodyX + bodyW} cy={bodyY + bodyH / 2} r={2} fill={stateColor} />
      </g>

      {/* "HMI" text below screen */}
      <text
        x={35}
        y={47}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={labelColor}
        textAnchor="middle"
      >
        {label || state}
      </text>
    </svg>
  );
}
