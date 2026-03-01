import React from 'react';

interface AlarmHornSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'SILENT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function AlarmHornSymbol({
  width = 50,
  height = 50,
  state = 'SILENT',
  color,
  onClick,
  label,
  className,
  rotation = 0,
}: AlarmHornSymbolProps) {
  const isActive = state === 'ACTIVE';
  const hornColor = color || (isActive ? '#DC2626' : '#9CA3AF');
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Alarm Horn (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes alarm-horn-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          .alarm-horn-pulse {
            animation: alarm-horn-pulse 0.6s ease-in-out infinite;
          }
        `}
      </style>

      {/* Left connection line (input) */}
      <line
        x1={0}
        y1={25}
        x2={8}
        y2={25}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Connection terminal */}
      <circle cx={8} cy={25} r={1.5} fill="#1F2937" />

      {/* Horn/megaphone body - trapezoid shape opening to right */}
      <polygon
        points="10,19 10,31 30,37 30,13"
        fill={isActive ? hornColor : 'none'}
        fillOpacity={isActive ? 0.2 : 0}
        stroke={hornColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Horn opening flare */}
      <line
        x1={30}
        y1={13}
        x2={30}
        y2={37}
        stroke={hornColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Sound wave arcs when ACTIVE */}
      {isActive && (
        <g className="alarm-horn-pulse">
          {/* First sound wave arc */}
          <path
            d="M 33,18 Q 38,25 33,32"
            fill="none"
            stroke={hornColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* Second sound wave arc */}
          <path
            d="M 36,14 Q 43,25 36,36"
            fill="none"
            stroke={hornColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* Third sound wave arc */}
          <path
            d="M 39,10 Q 48,25 39,40"
            fill="none"
            stroke={hornColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Label text */}
      <text
        x={25}
        y={47}
        textAnchor="middle"
        fill="#1E293B"
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || state}
      </text>
    </svg>
  );
}
