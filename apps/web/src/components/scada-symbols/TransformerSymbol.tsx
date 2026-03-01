import React from 'react';

interface TransformerSymbolProps {
  width?: number;
  height?: number;
  variant?: '2-winding' | '3-winding';
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function TransformerSymbol({
  width = 70,
  height = 100,
  variant = '2-winding',
  state = 'ENERGIZED',
  color,
  onClick,
  label,
}: TransformerSymbolProps) {
  const strokeColor = color || (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');
  const fillNone = 'none';
  const strokeWidth = 2;
  const labelColor = state === 'ENERGIZED' ? '#1E293B' : '#9CA3AF';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 100"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Power Transformer (${variant}, ${state})`}
    >
      {variant === '2-winding' ? (
        <>
          {/* HV connection line (top) */}
          <line
            x1={35}
            y1={0}
            x2={35}
            y2={22}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />

          {/* HV winding - upper circle (primary) */}
          <circle
            cx={35}
            cy={38}
            r={16}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={fillNone}
          />

          {/* LV winding - lower circle (secondary), overlapping */}
          <circle
            cx={35}
            cy={58}
            r={16}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={fillNone}
          />

          {/* LV connection line (bottom) */}
          <line
            x1={35}
            y1={74}
            x2={35}
            y2={85}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />

          {/* HV label */}
          <text
            x={56}
            y={40}
            fontSize={9}
            fontFamily="Arial, sans-serif"
            fontWeight="600"
            fill={labelColor}
            textAnchor="start"
          >
            HV
          </text>

          {/* LV label */}
          <text
            x={56}
            y={62}
            fontSize={9}
            fontFamily="Arial, sans-serif"
            fontWeight="600"
            fill={labelColor}
            textAnchor="start"
          >
            LV
          </text>

          {/* Dot convention markers (polarity) */}
          <circle cx={27} cy={28} r={2} fill={strokeColor} />
          <circle cx={27} cy={68} r={2} fill={strokeColor} />
        </>
      ) : (
        <>
          {/* 3-winding transformer */}
          {/* HV connection line (top) */}
          <line
            x1={35}
            y1={0}
            x2={35}
            y2={15}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />

          {/* HV winding - upper circle (primary) */}
          <circle
            cx={35}
            cy={29}
            r={14}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={fillNone}
          />

          {/* MV winding - middle circle (secondary) */}
          <circle
            cx={35}
            cy={50}
            r={14}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={fillNone}
          />

          {/* LV winding - lower circle (tertiary) */}
          <circle
            cx={35}
            cy={71}
            r={14}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={fillNone}
          />

          {/* LV connection line (bottom) */}
          <line
            x1={35}
            y1={85}
            x2={35}
            y2={100}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />

          {/* MV tap connection (right side) */}
          <line
            x1={49}
            y1={50}
            x2={62}
            y2={50}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />

          {/* HV label */}
          <text
            x={55}
            y={32}
            fontSize={8}
            fontFamily="Arial, sans-serif"
            fontWeight="600"
            fill={labelColor}
            textAnchor="start"
          >
            HV
          </text>

          {/* MV label */}
          <text
            x={55}
            y={43}
            fontSize={8}
            fontFamily="Arial, sans-serif"
            fontWeight="600"
            fill={labelColor}
            textAnchor="start"
          >
            MV
          </text>

          {/* LV label */}
          <text
            x={55}
            y={74}
            fontSize={8}
            fontFamily="Arial, sans-serif"
            fontWeight="600"
            fill={labelColor}
            textAnchor="start"
          >
            LV
          </text>

          {/* Dot convention markers (polarity) */}
          <circle cx={25} cy={20} r={2} fill={strokeColor} />
          <circle cx={25} cy={41} r={2} fill={strokeColor} />
          <circle cx={25} cy={62} r={2} fill={strokeColor} />
        </>
      )}

      {/* Label text */}
      {label && (
        <text
          x={35}
          y={variant === '2-winding' ? 97 : 98}
          fontSize={9}
          fontFamily="Arial, sans-serif"
          fontWeight="500"
          fill={labelColor}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
