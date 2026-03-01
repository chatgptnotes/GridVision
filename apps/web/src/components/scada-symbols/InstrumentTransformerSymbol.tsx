import React from 'react';

interface InstrumentTransformerSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function InstrumentTransformerSymbol({
  width = 60,
  height = 80,
  state = 'ENERGIZED',
  color,
  onClick,
  label,
  className,
  rotation,
}: InstrumentTransformerSymbolProps) {
  const strokeColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'ENERGIZED' ? '#1E293B' : '#9CA3AF';

  // Combined CT/PT unit: two small circles side by side
  const ctCx = 20;
  const ptCx = 40;
  const circleCy = 35;
  const circleR = 10;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Instrument Transformer CT/PT (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line (CT input) */}
      <line
        x1={ctCx}
        y1={0}
        x2={ctCx}
        y2={circleCy - circleR}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot (CT) */}
      <circle cx={ctCx} cy={0} r={3} fill={strokeColor} />

      {/* Top connection line (PT input) */}
      <line
        x1={ptCx}
        y1={0}
        x2={ptCx}
        y2={circleCy - circleR}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot (PT) */}
      <circle cx={ptCx} cy={0} r={3} fill={strokeColor} />

      {/* CT circle (left) */}
      <circle
        cx={ctCx}
        cy={circleCy}
        r={circleR}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fillNone}
      />

      {/* CT label inside circle */}
      <text
        x={ctCx}
        y={circleCy + 3}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={labelColor}
        textAnchor="middle"
      >
        CT
      </text>

      {/* PT circle (right) */}
      <circle
        cx={ptCx}
        cy={circleCy}
        r={circleR}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fillNone}
      />

      {/* PT label inside circle */}
      <text
        x={ptCx}
        y={circleCy + 3}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={labelColor}
        textAnchor="middle"
      >
        PT
      </text>

      {/* Bottom connection line (CT output) */}
      <line
        x1={ctCx}
        y1={circleCy + circleR}
        x2={ctCx}
        y2={62}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot (CT) */}
      <circle cx={ctCx} cy={62} r={3} fill={strokeColor} />

      {/* Bottom connection line (PT output) */}
      <line
        x1={ptCx}
        y1={circleCy + circleR}
        x2={ptCx}
        y2={62}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot (PT) */}
      <circle cx={ptCx} cy={62} r={3} fill={strokeColor} />

      {/* Label text at bottom */}
      <text
        x={30}
        y={76}
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
