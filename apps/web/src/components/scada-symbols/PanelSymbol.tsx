import React from 'react';

interface PanelSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function PanelSymbol({
  width = 80,
  height = 60,
  state = 'ACTIVE',
  color,
  onClick,
  label,
  className,
  rotation,
}: PanelSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const ledColor = state === 'ACTIVE' ? '#16A34A' : '#9CA3AF';
  const strokeWidth = 2;
  const labelColor = state === 'INACTIVE' ? '#9CA3AF' : '#1E293B';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Control Panel (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={rotation ? `rotate(${rotation} 40 30)` : undefined}>
        {/* Outer enclosure rectangle */}
        <rect
          x={5}
          y={4}
          width={70}
          height={44}
          rx={2}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Inner panel front rectangle */}
        <rect
          x={10}
          y={9}
          width={60}
          height={34}
          rx={1}
          fill="none"
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={state === 'INACTIVE' ? '3,2' : 'none'}
        />

        {/* Label area at top (panel name zone) */}
        <line
          x1={10}
          y1={18}
          x2={70}
          y2={18}
          stroke={stateColor}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Panel name text in label area */}
        <text
          x={40}
          y={15}
          fontSize={7}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          PANEL
        </text>

        {/* Status LED dot in top-left corner */}
        <circle
          cx={15}
          cy={13}
          r={2.5}
          fill={ledColor}
          stroke={ledColor}
          strokeWidth={0.5}
        />
        {/* LED glow when active */}
        {state === 'ACTIVE' && (
          <circle
            cx={15}
            cy={13}
            r={4}
            fill={ledColor}
            opacity={0.2}
          />
        )}

        {/* Door handle indicator (small circle on right edge) */}
        <circle
          cx={67}
          cy={30}
          r={2}
          fill="none"
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Panel interior details - horizontal line dividers */}
        <line
          x1={14}
          y1={26}
          x2={62}
          y2={26}
          stroke={stateColor}
          strokeWidth={0.5}
          strokeLinecap="round"
          opacity={0.3}
        />
        <line
          x1={14}
          y1={34}
          x2={62}
          y2={34}
          stroke={stateColor}
          strokeWidth={0.5}
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Connection points (top and bottom) */}
        <circle cx={40} cy={4} r={2.5} fill={stateColor} />
        <circle cx={40} cy={48} r={2.5} fill={stateColor} />
      </g>

      {/* Label text */}
      <text
        x={40}
        y={57}
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
