import React from 'react';

interface GroundSymbolProps {
  width?: number;
  height?: number;
  type?: 'standard' | 'chassis' | 'signal';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function GroundSymbol({
  width = 30,
  height = 40,
  type = 'standard',
  color = '#374151',
  onClick,
  label,
}: GroundSymbolProps) {
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 40"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {type === 'standard' && (
        <>
          {/* Vertical stem from top */}
          <line
            x1={15}
            y1={0}
            x2={15}
            y2={14}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* First ground line (widest) */}
          <line
            x1={3}
            y1={14}
            x2={27}
            y2={14}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Second ground line */}
          <line
            x1={7}
            y1={20}
            x2={23}
            y2={20}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Third ground line (narrowest) */}
          <line
            x1={11}
            y1={26}
            x2={19}
            y2={26}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </>
      )}

      {type === 'chassis' && (
        <>
          {/* Vertical stem from top */}
          <line
            x1={15}
            y1={0}
            x2={15}
            y2={10}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Chassis circle */}
          <circle
            cx={15}
            cy={18}
            r={8}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
          {/* Horizontal chassis line through circle */}
          <line
            x1={7}
            y1={18}
            x2={23}
            y2={18}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* Diagonal lines from circle bottom — chassis pattern */}
          <line
            x1={10}
            y1={24}
            x2={7}
            y2={29}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <line
            x1={15}
            y1={26}
            x2={12}
            y2={31}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <line
            x1={20}
            y1={24}
            x2={17}
            y2={29}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      )}

      {type === 'signal' && (
        <>
          {/* Vertical stem from top */}
          <line
            x1={15}
            y1={0}
            x2={15}
            y2={10}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Signal ground triangle */}
          <polygon
            points="15,10 4,28 26,28"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </>
      )}

      {/* Label */}
      {label && (
        <text
          x={15}
          y={37}
          textAnchor="middle"
          fill={color}
          fontSize={7}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
