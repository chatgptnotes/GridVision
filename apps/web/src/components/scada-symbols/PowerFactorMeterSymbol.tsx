import React from 'react';

interface PowerFactorMeterSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function PowerFactorMeterSymbol({
  width = 50,
  height = 50,
  state = 'ACTIVE',
  color,
  onClick,
  label,
}: PowerFactorMeterSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;
  const cx = 25;
  const cy = 22;
  const radius = 16;

  // Scale arc from LAG to LEAD (semi-circle at top, from ~210 deg to ~330 deg)
  // Arc from about -60 deg to +60 deg from top (12 o'clock)
  const arcStartAngle = -60;
  const arcEndAngle = 60;
  const arcR = 12;

  const startRad = ((arcStartAngle - 90) * Math.PI) / 180;
  const endRad = ((arcEndAngle - 90) * Math.PI) / 180;

  const arcStartX = cx + arcR * Math.cos(startRad);
  const arcStartY = cy + arcR * Math.sin(startRad);
  const arcEndX = cx + arcR * Math.cos(endRad);
  const arcEndY = cy + arcR * Math.sin(endRad);

  // Needle pointing at ~15 degrees (slightly leading)
  const needleAngle = 10;
  const needleRad = ((needleAngle - 90) * Math.PI) / 180;
  const needleLength = 12;
  const needleX = cx + needleLength * Math.cos(needleRad);
  const needleY = cy + needleLength * Math.sin(needleRad);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Power Factor Meter (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left connection line */}
      <line
        x1={0}
        y1={cy}
        x2={9}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={0} cy={cy} r={3} fill={stateColor} />

      {/* Right connection line */}
      <line
        x1={41}
        y1={cy}
        x2={50}
        y2={cy}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={50} cy={cy} r={3} fill={stateColor} />

      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#FFFFFF"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Scale arc from LAG to LEAD */}
      <path
        d={`M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 0 1 ${arcEndX} ${arcEndY}`}
        fill="none"
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
      />

      {/* Scale tick marks along the arc */}
      {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((angle, i) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        const innerR = 10.5;
        const outerR = 12;
        const x1 = cx + innerR * Math.cos(rad);
        const y1 = cy + innerR * Math.sin(rad);
        const x2 = cx + outerR * Math.cos(rad);
        const y2 = cy + outerR * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={stateColor}
            strokeWidth={angle === 0 ? 1.2 : 0.6}
            strokeLinecap="round"
          />
        );
      })}

      {/* "LAG" label (left side of arc) */}
      <text
        x={14}
        y={13}
        textAnchor="middle"
        fill={stateColor}
        fontSize={3.5}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        LAG
      </text>

      {/* "LEAD" label (right side of arc) */}
      <text
        x={36}
        y={13}
        textAnchor="middle"
        fill={stateColor}
        fontSize={3.5}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        LEAD
      </text>

      {/* "1.0" at center top of arc */}
      <text
        x={cx}
        y={12}
        textAnchor="middle"
        fill={stateColor}
        fontSize={3.5}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        1.0
      </text>

      {/* "PF" text */}
      <text
        x={cx}
        y={30}
        textAnchor="middle"
        fill={stateColor}
        fontSize={9}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        PF
      </text>

      {/* Needle indicator */}
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

      {/* Label below */}
      <text
        x={cx}
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
