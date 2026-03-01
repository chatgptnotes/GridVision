import React from 'react';

interface SynchroscopeSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SynchroscopeSymbol({
  width = 50,
  height = 60,
  state = 'ACTIVE',
  color,
  onClick,
  label,
}: SynchroscopeSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;
  const cx = 25;
  const cy = 22;
  const radius = 16;

  // Pointer angle (pointing near 12 o'clock when synced)
  const pointerAngle = 15; // degrees from 12 o'clock
  const pointerRad = (pointerAngle * Math.PI) / 180;
  const pointerLength = 12;
  const pointerX = cx + pointerLength * Math.sin(pointerRad);
  const pointerY = cy - pointerLength * Math.cos(pointerRad);

  // Tick mark positions at 12, 3, 6, 9 o'clock
  const tickAngles = [0, 90, 180, 270];
  const tickLabels = ['S', '', '', ''];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Synchroscope (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#FFFFFF"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Phase angle indicator tick marks at 12, 3, 6, 9 positions */}
      {tickAngles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const innerR = 13;
        const outerR = 15.5;
        const x1 = cx + innerR * Math.sin(rad);
        const y1 = cy - innerR * Math.cos(rad);
        const x2 = cx + outerR * Math.sin(rad);
        const y2 = cy - outerR * Math.cos(rad);
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stateColor}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* Additional minor tick marks */}
      {[45, 135, 225, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const innerR = 14;
        const outerR = 15.5;
        const x1 = cx + innerR * Math.sin(rad);
        const y1 = cy - innerR * Math.cos(rad);
        const x2 = cx + outerR * Math.sin(rad);
        const y2 = cy - outerR * Math.cos(rad);
        return (
          <line
            key={`minor-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={stateColor}
            strokeWidth={0.8}
            strokeLinecap="round"
          />
        );
      })}

      {/* "S" mark at 12 o'clock position (inside) */}
      <text
        x={cx}
        y={13}
        textAnchor="middle"
        fill={stateColor}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        S
      </text>

      {/* FAST / SLOW labels */}
      <text
        x={cx - 8}
        y={26}
        textAnchor="middle"
        fill={stateColor}
        fontSize={3.5}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        FAST
      </text>
      <text
        x={cx + 8}
        y={26}
        textAnchor="middle"
        fill={stateColor}
        fontSize={3.5}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        SLOW
      </text>

      {/* Rotating pointer */}
      <line
        x1={cx}
        y1={cy}
        x2={pointerX}
        y2={pointerY}
        stroke={state === 'ACTIVE' ? '#DC2626' : '#D1D5DB'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Pointer pivot center */}
      <circle
        cx={cx}
        cy={cy}
        r={2}
        fill={stateColor}
      />

      {/* Two input connections on bottom */}
      <line
        x1={18}
        y1={38}
        x2={18}
        y2={48}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={18} cy={48} r={3} fill={stateColor} />

      <line
        x1={32}
        y1={38}
        x2={32}
        y2={48}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={32} cy={48} r={3} fill={stateColor} />

      {/* Input labels */}
      <text
        x={18}
        y={42}
        textAnchor="middle"
        fill={stateColor}
        fontSize={3.5}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        BUS
      </text>
      <text
        x={32}
        y={42}
        textAnchor="middle"
        fill={stateColor}
        fontSize={3.5}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        GEN
      </text>

      {/* Label below */}
      <text
        x={25}
        y={57}
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
