import React from 'react';

interface FuseSymbolProps {
  width?: number;
  height?: number;
  state?: 'HEALTHY' | 'BLOWN';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function FuseSymbol({
  width = 50,
  height = 60,
  state = 'HEALTHY',
  color,
  onClick,
  label,
}: FuseSymbolProps) {
  const stateColor =
    color || (state === 'HEALTHY' ? '#334155' : '#DC2626');

  const strokeWidth = 2.5;
  const cx = 25;
  const rectTop = 16;
  const rectHeight = 28;
  const rectWidth = 22;
  const rectLeft = cx - rectWidth / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={rectTop}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom connection line */}
      <line
        x1={cx}
        y1={rectTop + rectHeight}
        x2={cx}
        y2={52}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* IEC Fuse body: rectangle */}
      <rect
        x={rectLeft}
        y={rectTop}
        width={rectWidth}
        height={rectHeight}
        fill={state === 'BLOWN' ? 'rgba(220, 38, 38, 0.08)' : 'white'}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        rx={1}
      />

      {state === 'HEALTHY' ? (
        <>
          {/* Healthy: continuous fuse element line through center */}
          <line
            x1={cx}
            y1={rectTop}
            x2={cx}
            y2={rectTop + rectHeight}
            stroke={stateColor}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Blown: broken fuse element with gap in center */}
          <line
            x1={cx}
            y1={rectTop}
            x2={cx}
            y2={rectTop + rectHeight / 2 - 4}
            stroke={stateColor}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <line
            x1={cx}
            y1={rectTop + rectHeight / 2 + 4}
            x2={cx}
            y2={rectTop + rectHeight}
            stroke={stateColor}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          {/* Blown arc marks around the gap */}
          <path
            d={`M ${cx - 4} ${rectTop + rectHeight / 2 - 3} Q ${cx} ${rectTop + rectHeight / 2} ${cx + 4} ${rectTop + rectHeight / 2 - 3}`}
            fill="none"
            stroke={stateColor}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 4} ${rectTop + rectHeight / 2 + 3} Q ${cx} ${rectTop + rectHeight / 2} ${cx + 4} ${rectTop + rectHeight / 2 + 3}`}
            fill="none"
            stroke={stateColor}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        </>
      )}

      {/* Label */}
      <text
        x={cx}
        y={57}
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
