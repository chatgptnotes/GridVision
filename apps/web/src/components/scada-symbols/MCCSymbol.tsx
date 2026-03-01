import React from 'react';

interface MCCSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function MCCSymbol({
  width = 80,
  height = 70,
  state = 'ACTIVE',
  color,
  onClick,
  label,
  className,
  rotation,
}: MCCSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const ledColor = state === 'ACTIVE' ? '#16A34A' : '#9CA3AF';
  const strokeWidth = 2;
  const labelColor = state === 'INACTIVE' ? '#9CA3AF' : '#1E293B';

  // Drawer section layout
  const rectX = 14;
  const rectY = 5;
  const rectW = 60;
  const rectH = 50;
  const sectionCount = 3;
  const headerH = 12;
  const sectionH = (rectH - headerH) / sectionCount;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Motor Control Center (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={rotation ? `rotate(${rotation} 40 35)` : undefined}>
        {/* Connection bus on left side (thick vertical line) */}
        <line
          x1={8}
          y1={8}
          x2={8}
          y2={52}
          stroke={stateColor}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Bus connection stubs to each drawer */}
        {Array.from({ length: sectionCount }).map((_, i) => {
          const sectionY = rectY + headerH + i * sectionH + sectionH / 2;
          return (
            <line
              key={`bus-stub-${i}`}
              x1={8}
              y1={sectionY}
              x2={rectX}
              y2={sectionY}
              stroke={stateColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          );
        })}

        {/* Main MCC enclosure rectangle */}
        <rect
          x={rectX}
          y={rectY}
          width={rectW}
          height={rectH}
          rx={2}
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Header section divider */}
        <line
          x1={rectX}
          y1={rectY + headerH}
          x2={rectX + rectW}
          y2={rectY + headerH}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* "MCC" text at top */}
        <text
          x={rectX + rectW / 2}
          y={rectY + headerH / 2 + 1}
          fontSize={9}
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fill={stateColor}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          MCC
        </text>

        {/* Drawer sections with dividers and status indicators */}
        {Array.from({ length: sectionCount }).map((_, i) => {
          const sectionY = rectY + headerH + i * sectionH;
          return (
            <g key={`section-${i}`}>
              {/* Drawer divider line (except for first section) */}
              {i > 0 && (
                <line
                  x1={rectX}
                  y1={sectionY}
                  x2={rectX + rectW}
                  y2={sectionY}
                  stroke={stateColor}
                  strokeWidth={1}
                  strokeLinecap="round"
                  opacity={0.6}
                />
              )}

              {/* Section label */}
              <text
                x={rectX + 14}
                y={sectionY + sectionH / 2 + 1}
                fontSize={6}
                fontFamily="Arial, sans-serif"
                fontWeight="500"
                fill={stateColor}
                textAnchor="start"
                dominantBaseline="middle"
                opacity={0.8}
              >
                {`DRW${i + 1}`}
              </text>

              {/* Status indicator dot for each section */}
              <circle
                cx={rectX + rectW - 10}
                cy={sectionY + sectionH / 2}
                r={2.5}
                fill={ledColor}
                stroke={ledColor}
                strokeWidth={0.5}
              />
            </g>
          );
        })}

        {/* Top connection point */}
        <circle cx={rectX + rectW / 2} cy={rectY} r={2.5} fill={stateColor} />

        {/* Bottom connection point */}
        <circle cx={rectX + rectW / 2} cy={rectY + rectH} r={2.5} fill={stateColor} />
      </g>

      {/* Label text */}
      <text
        x={40}
        y={65}
        fontSize={8}
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
