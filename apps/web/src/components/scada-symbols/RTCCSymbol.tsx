import React from 'react';

interface RTCCSymbolProps {
  width?: number;
  height?: number;
  state?: 'AUTO' | 'MANUAL' | 'LOCAL';
  tapPosition?: number;
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function RTCCSymbol({
  width = 70,
  height = 50,
  state = 'AUTO',
  tapPosition = 0,
  color,
  onClick,
  label,
}: RTCCSymbolProps) {
  const stateColor =
    color ||
    (state === 'AUTO' ? '#16A34A' : state === 'MANUAL' ? '#EAB308' : '#3B82F6');

  const borderColor = '#475569';
  const textColor = '#1E293B';
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={
        label || `Remote Tap Change Controller (${state}, tap ${tapPosition})`
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main enclosure rectangle */}
      <rect
        x={4}
        y={4}
        width={62}
        height={36}
        rx={3}
        fill="#FFFFFF"
        stroke={borderColor}
        strokeWidth={strokeWidth}
      />

      {/* Status indicator dot (top-right corner) */}
      <circle
        cx={58}
        cy={11}
        r={4}
        fill={stateColor}
      />

      {/* "RTCC" label text */}
      <text
        x={10}
        y={16}
        fill={textColor}
        fontSize={9}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        RTCC
      </text>

      {/* Tap position indicator section */}
      {/* Tap position display box */}
      <rect
        x={10}
        y={21}
        width={22}
        height={14}
        rx={2}
        fill={stateColor}
        fillOpacity={0.12}
        stroke={stateColor}
        strokeWidth={1}
      />

      {/* Tap position number */}
      <text
        x={21}
        y={32}
        textAnchor="middle"
        fill={textColor}
        fontSize={10}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        {tapPosition}
      </text>

      {/* Up arrow (raise tap) */}
      <line
        x1={44}
        y1={33}
        x2={44}
        y2={22}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <polyline
        points="41,25 44,22 47,25"
        fill="none"
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Down arrow (lower tap) */}
      <line
        x1={54}
        y1={22}
        x2={54}
        y2={33}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <polyline
        points="51,30 54,33 57,30"
        fill="none"
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Input terminal (left) */}
      <line
        x1={0}
        y1={22}
        x2={4}
        y2={22}
        stroke={borderColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={1} cy={22} r={1.5} fill={borderColor} />

      {/* Output terminal (right) */}
      <line
        x1={66}
        y1={22}
        x2={70}
        y2={22}
        stroke={borderColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={69} cy={22} r={1.5} fill={borderColor} />

      {/* State label below */}
      <text
        x={35}
        y={48}
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
