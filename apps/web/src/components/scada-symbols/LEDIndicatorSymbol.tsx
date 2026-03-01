import React from 'react';

interface LEDIndicatorSymbolProps {
  width?: number;
  height?: number;
  state?: 'RED' | 'GREEN' | 'AMBER' | 'BLUE' | 'OFF';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function LEDIndicatorSymbol({
  width = 20,
  height = 30,
  state = 'OFF',
  color,
  onClick,
  label,
  className,
  rotation = 0,
}: LEDIndicatorSymbolProps) {
  const stateColorMap: Record<string, string> = {
    RED: '#DC2626',
    GREEN: '#16A34A',
    AMBER: '#D97706',
    BLUE: '#2563EB',
    OFF: '#9CA3AF',
  };

  const ledColor = color || stateColorMap[state] || '#9CA3AF';
  const isOff = state === 'OFF';
  const strokeWidth = 2;
  const gradientId = `led-glow-${state}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 30"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `LED Indicator (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes led-indicator-glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .led-indicator-active {
            animation: led-indicator-glow 1.5s ease-in-out infinite;
          }
        `}
      </style>

      <defs>
        {/* Radial gradient for glow effect when not OFF */}
        {!isOff && (
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ledColor} stopOpacity={1} />
            <stop offset="50%" stopColor={ledColor} stopOpacity={0.8} />
            <stop offset="100%" stopColor={ledColor} stopOpacity={0.3} />
          </radialGradient>
        )}
      </defs>

      {/* Outer glow when active */}
      {!isOff && (
        <circle
          cx={10}
          cy={12}
          r={8}
          fill={ledColor}
          fillOpacity={0.15}
          className="led-indicator-active"
        />
      )}

      {/* LED body circle */}
      <circle
        cx={10}
        cy={12}
        r={6}
        fill={isOff ? ledColor : `url(#${gradientId})`}
        fillOpacity={isOff ? 0.3 : 1}
        stroke={ledColor}
        strokeWidth={strokeWidth}
        className={!isOff ? 'led-indicator-active' : undefined}
      />

      {/* LED highlight (specular reflection) */}
      <circle
        cx={8}
        cy={10}
        r={2}
        fill="#FFFFFF"
        fillOpacity={isOff ? 0.1 : 0.4}
      />

      {/* Connection line below (left leg) */}
      <line
        x1={7}
        y1={18}
        x2={7}
        y2={24}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Connection line below (right leg) */}
      <line
        x1={13}
        y1={18}
        x2={13}
        y2={22}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Connection terminals */}
      <circle cx={7} cy={24} r={1} fill="#1F2937" />
      <circle cx={13} cy={22} r={1} fill="#1F2937" />

      {/* Label text */}
      <text
        x={10}
        y={29}
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
