import React from 'react';

interface StepVoltageRegulatorSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function StepVoltageRegulatorSymbol({
  width = 60,
  height = 90,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
  className,
  rotation,
}: StepVoltageRegulatorSymbolProps) {
  const strokeColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'ENERGIZED' ? '#1E293B' : '#9CA3AF';

  // Step Voltage Regulator (IEEE): transformer circle with variable tap arrow
  const cx = 30;
  const coilCy = 40;
  const coilR = 16;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 90"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Step Voltage Regulator (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={coilCy - coilR}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={cx} cy={0} r={3} fill={strokeColor} />

      {/* Transformer circle */}
      <circle
        cx={cx}
        cy={coilCy}
        r={coilR}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fillNone}
      />

      {/* Variable tap arrow (diagonal arrow across the circle indicating adjustability) */}
      <line
        x1={cx - 10}
        y1={coilCy + 10}
        x2={cx + 10}
        y2={coilCy - 10}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Arrowhead at top-right end of tap arrow */}
      <polyline
        points={`${cx + 4},${coilCy - 10} ${cx + 10},${coilCy - 10} ${cx + 10},${coilCy - 4}`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fillNone}
      />

      {/* SVR text label inside circle */}
      <text
        x={cx}
        y={coilCy + 4}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={labelColor}
        textAnchor="middle"
      >
        SVR
      </text>

      {/* Bottom connection line */}
      <line
        x1={cx}
        y1={coilCy + coilR}
        x2={cx}
        y2={75}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={cx} cy={75} r={3} fill={strokeColor} />

      {/* Label text at bottom */}
      <text
        x={cx}
        y={87}
        fontSize={9}
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
