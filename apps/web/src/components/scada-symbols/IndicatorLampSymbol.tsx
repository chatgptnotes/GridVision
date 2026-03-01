import React from 'react';

interface IndicatorLampSymbolProps {
  width?: number;
  height?: number;
  state?: 'RED' | 'GREEN' | 'AMBER' | 'OFF';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function IndicatorLampSymbol({
  width = 30,
  height = 40,
  state = 'OFF',
  color,
  onClick,
  label,
  className,
  rotation = 0,
}: IndicatorLampSymbolProps) {
  const stateColorMap: Record<string, string> = {
    RED: '#DC2626',
    GREEN: '#16A34A',
    AMBER: '#D97706',
    OFF: '#9CA3AF',
  };

  const lampColor = color || stateColorMap[state] || '#9CA3AF';
  const isOff = state === 'OFF';
  const strokeWidth = 2;
  const gradientId = `indicator-lamp-glow-${state}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 40"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Indicator Lamp (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {rotation !== 0 && (
        <g transform={`rotate(${rotation} 15 20)`} />
      )}

      <defs>
        {/* Radial gradient for glow effect when not OFF */}
        {!isOff && (
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={lampColor} stopOpacity={0.9} />
            <stop offset="60%" stopColor={lampColor} stopOpacity={0.6} />
            <stop offset="100%" stopColor={lampColor} stopOpacity={0.2} />
          </radialGradient>
        )}
      </defs>

      {/* Top connection line */}
      <line
        x1={15}
        y1={0}
        x2={15}
        y2={8}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top connection terminal */}
      <circle cx={15} cy={8} r={1.5} fill="#1F2937" />

      {/* Lamp body circle */}
      <circle
        cx={15}
        cy={20}
        r={10}
        fill={isOff ? lampColor : `url(#${gradientId})`}
        fillOpacity={isOff ? 0.25 : 1}
        stroke={lampColor}
        strokeWidth={strokeWidth}
      />

      {/* Outer glow ring when active */}
      {!isOff && (
        <circle
          cx={15}
          cy={20}
          r={12}
          fill="none"
          stroke={lampColor}
          strokeWidth={0.8}
          strokeOpacity={0.4}
        />
      )}

      {/* Cross-hair filament: diagonal X pattern */}
      <line
        x1={10}
        y1={15}
        x2={20}
        y2={25}
        stroke={isOff ? '#6B7280' : '#FFFFFF'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeOpacity={isOff ? 0.5 : 0.9}
      />
      <line
        x1={20}
        y1={15}
        x2={10}
        y2={25}
        stroke={isOff ? '#6B7280' : '#FFFFFF'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeOpacity={isOff ? 0.5 : 0.9}
      />

      {/* Bottom connection terminal */}
      <circle cx={15} cy={32} r={1.5} fill="#1F2937" />

      {/* Bottom connection line */}
      <line
        x1={15}
        y1={32}
        x2={15}
        y2={40}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Label text */}
      <text
        x={15}
        y={38}
        textAnchor="middle"
        fill="#1E293B"
        fontSize={4}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || state}
      </text>
    </svg>
  );
}
