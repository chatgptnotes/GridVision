import React from 'react';

interface CableSymbolProps {
  width?: number;
  height?: number;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function CableSymbol({
  width,
  height,
  direction = 'horizontal',
  color = '#374151',
  onClick,
  label,
}: CableSymbolProps) {
  const defaultWidth = direction === 'vertical' ? 20 : 80;
  const defaultHeight = direction === 'vertical' ? 80 : direction === 'diagonal' ? 60 : 20;
  const svgWidth = width ?? defaultWidth;
  const svgHeight = height ?? defaultHeight;

  const viewBoxMap: Record<string, string> = {
    horizontal: '0 0 80 20',
    vertical: '0 0 20 80',
    diagonal: '0 0 80 60',
  };
  const viewBox = viewBoxMap[direction];

  const strokeWidth = 2;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={viewBox}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Arrowhead marker */}
        <marker
          id="cable-arrow"
          viewBox="0 0 10 8"
          refX={9}
          refY={4}
          markerWidth={8}
          markerHeight={6}
          orient="auto-start-reverse"
          fill={color}
        >
          <path d="M 0 0 L 10 4 L 0 8 Z" />
        </marker>
      </defs>

      {direction === 'horizontal' && (
        <>
          {/* Dashed cable line with direction arrow */}
          <line
            x1={4}
            y1={10}
            x2={68}
            y2={10}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="6 3"
            strokeLinecap="round"
            markerEnd="url(#cable-arrow)"
          />
          {/* Left terminal dot */}
          <circle cx={4} cy={10} r={2.5} fill={color} />
          {/* Right terminal dot */}
          <circle cx={76} cy={10} r={2.5} fill={color} />
        </>
      )}

      {direction === 'vertical' && (
        <>
          {/* Dashed cable line with direction arrow */}
          <line
            x1={10}
            y1={4}
            x2={10}
            y2={68}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="6 3"
            strokeLinecap="round"
            markerEnd="url(#cable-arrow)"
          />
          {/* Top terminal dot */}
          <circle cx={10} cy={4} r={2.5} fill={color} />
          {/* Bottom terminal dot */}
          <circle cx={10} cy={76} r={2.5} fill={color} />
        </>
      )}

      {direction === 'diagonal' && (
        <>
          {/* Dashed diagonal cable line with direction arrow */}
          <line
            x1={6}
            y1={54}
            x2={66}
            y2={8}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray="6 3"
            strokeLinecap="round"
            markerEnd="url(#cable-arrow)"
          />
          {/* Start terminal dot */}
          <circle cx={6} cy={54} r={2.5} fill={color} />
          {/* End terminal dot */}
          <circle cx={74} cy={4} r={2.5} fill={color} />
        </>
      )}

      {/* Label */}
      {label && (
        <text
          x={direction === 'vertical' ? 10 : 40}
          y={direction === 'vertical' ? 44 : direction === 'diagonal' ? 55 : 18}
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
