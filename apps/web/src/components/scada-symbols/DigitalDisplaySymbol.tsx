import React from 'react';

interface DigitalDisplaySymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  value?: string;
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function DigitalDisplaySymbol({
  width = 60,
  height = 40,
  state = 'INACTIVE',
  value = '888',
  color,
  onClick,
  label,
  className,
  rotation = 0,
}: DigitalDisplaySymbolProps) {
  const isActive = state === 'ACTIVE';
  const displayColor = color || (isActive ? '#16A34A' : '#9CA3AF');
  const strokeWidth = 2;
  const bgColor = '#1A1A2E';

  // 7-segment digit rendering
  // Segments: a(top), b(top-right), c(bottom-right), d(bottom), e(bottom-left), f(top-left), g(middle)
  const segmentMap: Record<string, boolean[]> = {
    '0': [true, true, true, true, true, true, false],
    '1': [false, true, true, false, false, false, false],
    '2': [true, true, false, true, true, false, true],
    '3': [true, true, true, true, false, false, true],
    '4': [false, true, true, false, false, true, true],
    '5': [true, false, true, true, false, true, true],
    '6': [true, false, true, true, true, true, true],
    '7': [true, true, true, false, false, false, false],
    '8': [true, true, true, true, true, true, true],
    '9': [true, true, true, true, false, true, true],
    '-': [false, false, false, false, false, false, true],
  };

  const renderDigit = (char: string, offsetX: number) => {
    const segments = segmentMap[char];
    const segW = 8; // horizontal segment width
    const segH = 2; // segment thickness
    const digitH = 18; // total digit height
    const halfH = digitH / 2;

    if (!segments) {
      // Unknown char, show all segments as outline
      return renderDigitSegments(offsetX, segW, segH, halfH, Array(7).fill(true), true);
    }

    return renderDigitSegments(offsetX, segW, segH, halfH, segments, false);
  };

  const renderDigitSegments = (
    offsetX: number,
    segW: number,
    segH: number,
    halfH: number,
    segments: boolean[],
    outlineOnly: boolean
  ) => {
    const activeOpacity = outlineOnly ? 0.15 : 1;
    const inactiveOpacity = 0.1;
    const segColor = displayColor;

    // Segment positions: [x, y, width, height, isHorizontal]
    const segDefs: [number, number, number, number][] = [
      [offsetX + 1, 8, segW, segH],              // a - top horizontal
      [offsetX + segW + 1, 8 + 1, segH, halfH - 1], // b - top-right vertical
      [offsetX + segW + 1, 8 + halfH + 1, segH, halfH - 1], // c - bottom-right vertical
      [offsetX + 1, 8 + halfH * 2, segW, segH],  // d - bottom horizontal
      [offsetX - 1, 8 + halfH + 1, segH, halfH - 1], // e - bottom-left vertical
      [offsetX - 1, 8 + 1, segH, halfH - 1],     // f - top-left vertical
      [offsetX + 1, 8 + halfH, segW, segH],       // g - middle horizontal
    ];

    return (
      <g key={offsetX}>
        {segDefs.map(([x, y, w, h], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={0.5}
            fill={segColor}
            fillOpacity={segments[i] ? activeOpacity : inactiveOpacity}
          />
        ))}
      </g>
    );
  };

  // Determine display characters
  const displayChars = isActive
    ? (value || '888').padStart(3, ' ').slice(-3)
    : '---';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 40"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Digital Display (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes digital-display-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
          }
          .digital-display-active {
            animation: digital-display-blink 2s ease-in-out infinite;
          }
        `}
      </style>

      {/* Display enclosure */}
      <rect
        x={2}
        y={2}
        width={56}
        height={30}
        rx={3}
        fill={bgColor}
        stroke="#374151"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Display inner bezel */}
      <rect
        x={5}
        y={5}
        width={50}
        height={24}
        rx={2}
        fill="#0F0F23"
        stroke="#2D2D4A"
        strokeWidth={0.5}
      />

      {/* Connection points - left and right */}
      <line
        x1={0}
        y1={17}
        x2={2}
        y2={17}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={2} cy={17} r={1} fill="#1F2937" />

      <line
        x1={58}
        y1={17}
        x2={60}
        y2={17}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={58} cy={17} r={1} fill="#1F2937" />

      {/* 7-segment digits */}
      <g className={isActive ? 'digital-display-active' : undefined}>
        {displayChars.split('').map((char, i) => (
          <g key={i}>
            {renderDigit(char, 10 + i * 15)}
          </g>
        ))}
      </g>

      {/* Status indicator dot */}
      {isActive && (
        <circle
          cx={52}
          cy={27}
          r={1.5}
          fill={displayColor}
          fillOpacity={0.8}
        />
      )}

      {/* Label text */}
      <text
        x={30}
        y={38}
        textAnchor="middle"
        fill="#1E293B"
        fontSize={5}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || state}
      </text>
    </svg>
  );
}
