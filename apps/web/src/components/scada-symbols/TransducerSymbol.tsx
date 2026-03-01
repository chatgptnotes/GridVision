import React from 'react';

interface TransducerSymbolProps {
  width?: number;
  height?: number;
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function TransducerSymbol({
  width = 60,
  height = 40,
  color = '#1F2937',
  onClick,
  label,
}: TransducerSymbolProps) {
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 40"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main transducer body rectangle */}
      <rect
        x={14}
        y={5}
        width={32}
        height={22}
        fill="white"
        stroke={color}
        strokeWidth={strokeWidth}
        rx={1}
      />

      {/* Input arrow on left (analog signal in) */}
      <line
        x1={0}
        y1={16}
        x2={14}
        y2={16}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Input arrowhead */}
      <polygon
        points="10,12 14,16 10,20"
        fill={color}
        stroke="none"
      />

      {/* Output arrow on right (converted signal out) */}
      <line
        x1={46}
        y1={16}
        x2={60}
        y2={16}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Output arrowhead */}
      <polygon
        points="56,12 60,16 56,20"
        fill={color}
        stroke="none"
      />

      {/* Signal conversion symbol inside rectangle: sine wave to square wave */}
      {/* Input sine wave (left half) */}
      <path
        d="M 18 16 Q 21 10, 24 16 Q 27 22, 30 16"
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />

      {/* Arrow in center showing conversion */}
      <line
        x1={31}
        y1={16}
        x2={34}
        y2={16}
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <polygon
        points="33,14 35.5,16 33,18"
        fill={color}
        stroke="none"
      />

      {/* Output square wave (right half) */}
      <polyline
        points="36,20 36,12 39,12 39,20 42,20 42,12"
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="miter"
      />

      {/* Input label */}
      <text
        x={3}
        y={30}
        textAnchor="start"
        fill={color}
        fontSize={5}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
      >
        IN
      </text>

      {/* Output label */}
      <text
        x={57}
        y={30}
        textAnchor="end"
        fill={color}
        fontSize={5}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
      >
        OUT
      </text>

      {/* Label below */}
      {label && (
        <text
          x={30}
          y={38}
          textAnchor="middle"
          fill={color}
          fontSize={6}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
