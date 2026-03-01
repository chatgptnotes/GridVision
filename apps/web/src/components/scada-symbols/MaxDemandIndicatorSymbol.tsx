import React from 'react';

interface MaxDemandIndicatorSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function MaxDemandIndicatorSymbol({
  width = 50,
  height = 50,
  state = 'ACTIVE',
  color,
  onClick,
  label,
}: MaxDemandIndicatorSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;

  // Needle pointing to ~75% position (about -30 degrees from top-right)
  const needleAngle = -30; // degrees from vertical (12 o'clock)
  const needleRadians = (needleAngle * Math.PI) / 180;
  const needleLength = 13;
  const cx = 25;
  const cy = 22;
  const needleX = cx + needleLength * Math.sin(needleRadians);
  const needleY = cy - needleLength * Math.cos(needleRadians);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Maximum Demand Indicator (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={18}
        fill="#FFFFFF"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Scale arc marks */}
      {[-120, -90, -60, -30, 0, 30, 60, 90, 120].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const innerR = 14;
        const outerR = 16.5;
        const x1 = cx + innerR * Math.sin(rad);
        const y1 = cy - innerR * Math.cos(rad);
        const x2 = cx + outerR * Math.sin(rad);
        const y2 = cy - outerR * Math.cos(rad);
        return (
          <line
            key={i}
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

      {/* "MD" text */}
      <text
        x={cx}
        y={18}
        textAnchor="middle"
        fill={stateColor}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        MD
      </text>

      {/* Pointer/needle indicator showing max position */}
      <line
        x1={cx}
        y1={cy}
        x2={needleX}
        y2={needleY}
        stroke={state === 'ACTIVE' ? '#DC2626' : '#D1D5DB'}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Needle pivot */}
      <circle
        cx={cx}
        cy={cy}
        r={2}
        fill={stateColor}
      />

      {/* Max demand marker (red triangle at needle tip) */}
      <circle
        cx={needleX}
        cy={needleY}
        r={1.5}
        fill={state === 'ACTIVE' ? '#DC2626' : '#D1D5DB'}
      />

      {/* Left connection line */}
      <line
        x1={0}
        y1={22}
        x2={7}
        y2={22}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={0} cy={22} r={3} fill={stateColor} />

      {/* Right connection line */}
      <line
        x1={43}
        y1={22}
        x2={50}
        y2={22}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={50} cy={22} r={3} fill={stateColor} />

      {/* Label below */}
      <text
        x={25}
        y={47}
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
