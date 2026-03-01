import React from 'react';

interface BusBarSymbolProps {
  width?: number;
  height?: number;
  orientation?: 'horizontal' | 'vertical';
  voltageLevel?: number;
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function BusBarSymbol({
  width,
  height,
  orientation = 'horizontal',
  voltageLevel,
  color,
  onClick,
  label,
}: BusBarSymbolProps) {
  const voltageColors: Record<number, string> = {
    132: '#1E40AF',
    33: '#DC2626',
    11: '#16A34A',
  };

  const barColor =
    color || (voltageLevel ? voltageColors[voltageLevel] || '#6B7280' : '#6B7280');

  const isHorizontal = orientation === 'horizontal';
  const defaultWidth = isHorizontal ? 120 : 20;
  const defaultHeight = isHorizontal ? 20 : 120;
  const svgWidth = width ?? defaultWidth;
  const svgHeight = height ?? defaultHeight;
  const viewBox = isHorizontal ? '0 0 120 20' : '0 0 20 120';

  const strokeWidth = 5;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={viewBox}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {isHorizontal ? (
        <>
          {/* Horizontal bus bar — thick horizontal line centered vertically */}
          <line
            x1={0}
            y1={10}
            x2={120}
            y2={10}
            stroke={barColor}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />
          {/* Left terminal cap */}
          <line
            x1={0}
            y1={5}
            x2={0}
            y2={15}
            stroke={barColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Right terminal cap */}
          <line
            x1={120}
            y1={5}
            x2={120}
            y2={15}
            stroke={barColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Vertical bus bar — thick vertical line centered horizontally */}
          <line
            x1={10}
            y1={0}
            x2={10}
            y2={120}
            stroke={barColor}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />
          {/* Top terminal cap */}
          <line
            x1={5}
            y1={0}
            x2={15}
            y2={0}
            stroke={barColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Bottom terminal cap */}
          <line
            x1={5}
            y1={120}
            x2={15}
            y2={120}
            stroke={barColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </>
      )}

      {/* Label */}
      {label && (
        <text
          x={isHorizontal ? 60 : 10}
          y={isHorizontal ? 18 : 65}
          textAnchor="middle"
          fill={barColor}
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
