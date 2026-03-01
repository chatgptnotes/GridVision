import React from 'react';

interface SelectorSwitchSymbolProps {
  width?: number;
  height?: number;
  state?: 'LOCAL' | 'REMOTE' | 'OFF';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SelectorSwitchSymbol({
  width = 50,
  height = 50,
  state = 'OFF',
  color,
  onClick,
  label,
  className,
  rotation = 0,
}: SelectorSwitchSymbolProps) {
  const stateColorMap: Record<string, string> = {
    LOCAL: '#16A34A',
    REMOTE: '#1E40AF',
    OFF: '#9CA3AF',
  };

  const switchColor = color || stateColorMap[state] || '#9CA3AF';
  const strokeWidth = 2;

  // Center of the switch
  const cx = 25;
  const cy = 23;
  const outerR = 14;

  // Three position marks at 120 degree intervals
  // LOCAL at top-left (210 degrees from right / -150 degrees)
  // OFF at top (90 degrees / straight up / 270 degrees from right)
  // REMOTE at top-right (330 degrees from right / -30 degrees)
  const positions: Record<string, { angle: number; labelText: string }> = {
    LOCAL: { angle: 210, labelText: 'L' },
    OFF: { angle: 270, labelText: 'O' },
    REMOTE: { angle: 330, labelText: 'R' },
  };

  // Arrow angle for current state
  const arrowAngle = positions[state]?.angle ?? 270;
  const arrowRad = (arrowAngle * Math.PI) / 180;
  const arrowLength = outerR - 3;
  const arrowX = cx + arrowLength * Math.cos(arrowRad);
  const arrowY = cy - arrowLength * Math.sin(arrowRad);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Selector Switch (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Connection lines - left and right */}
      <line
        x1={0}
        y1={cy}
        x2={cx - outerR}
        y2={cy}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={cx - outerR} cy={cy} r={1.5} fill="#1F2937" />

      <line
        x1={cx + outerR}
        y1={cy}
        x2={50}
        y2={cy}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={cx + outerR} cy={cy} r={1.5} fill="#1F2937" />

      {/* Outer circle (switch body) */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="none"
        stroke={switchColor}
        strokeWidth={strokeWidth}
      />

      {/* Inner circle (knob) */}
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={switchColor}
        fillOpacity={0.2}
        stroke={switchColor}
        strokeWidth={1.5}
      />

      {/* Position marks around the circle */}
      {Object.entries(positions).map(([posState, { angle, labelText }]) => {
        const rad = (angle * Math.PI) / 180;
        const markR = outerR + 4;
        const tickInner = outerR - 2;
        const tickOuter = outerR + 1;
        const mx = cx + markR * Math.cos(rad);
        const my = cy - markR * Math.sin(rad);
        const tx1 = cx + tickInner * Math.cos(rad);
        const ty1 = cy - tickInner * Math.sin(rad);
        const tx2 = cx + tickOuter * Math.cos(rad);
        const ty2 = cy - tickOuter * Math.sin(rad);
        const isActive = state === posState;

        return (
          <g key={posState}>
            {/* Tick mark */}
            <line
              x1={tx1}
              y1={ty1}
              x2={tx2}
              y2={ty2}
              stroke={isActive ? switchColor : '#9CA3AF'}
              strokeWidth={isActive ? 2 : 1}
              strokeLinecap="round"
            />
            {/* Position label */}
            <text
              x={mx}
              y={my + 2}
              textAnchor="middle"
              fill={isActive ? switchColor : '#9CA3AF'}
              fontSize={5}
              fontFamily="Arial, sans-serif"
              fontWeight={isActive ? '700' : '500'}
            >
              {labelText}
            </text>
          </g>
        );
      })}

      {/* Rotary indicator arrow from center to active position */}
      <line
        x1={cx}
        y1={cy}
        x2={arrowX}
        y2={arrowY}
        stroke={switchColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Arrow tip */}
      <circle
        cx={arrowX}
        cy={arrowY}
        r={2}
        fill={switchColor}
      />

      {/* Label text */}
      <text
        x={cx}
        y={46}
        textAnchor="middle"
        fill="#1E293B"
        fontSize={5}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || state}
      </text>
    </svg>
  );
}
