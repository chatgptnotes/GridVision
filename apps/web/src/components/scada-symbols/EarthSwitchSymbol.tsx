import React from 'react';

interface EarthSwitchSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function EarthSwitchSymbol({
  width = 50,
  height = 80,
  state = 'OPEN',
  color,
  onClick,
  label,
}: EarthSwitchSymbolProps) {
  const stateColor =
    color || (state === 'OPEN' ? '#16A34A' : '#DC2626');

  const strokeWidth = 2.5;
  const cx = 25;
  const pivotY = 36;
  const topTerminalY = 14;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={topTerminalY}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal point */}
      <circle
        cx={cx}
        cy={topTerminalY}
        r={3}
        fill={state === 'CLOSED' ? stateColor : 'white'}
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Pivot point at switch junction */}
      <circle cx={cx} cy={pivotY} r={3} fill={stateColor} />

      {state === 'CLOSED' ? (
        <>
          {/* Closed: blade connects from top terminal straight down to pivot */}
          <line
            x1={cx}
            y1={topTerminalY}
            x2={cx}
            y2={pivotY}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Open: blade rotated away from top terminal */}
          <line
            x1={cx}
            y1={pivotY}
            x2={cx + 16}
            y2={topTerminalY + 4}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Open end indicator */}
          <circle
            cx={cx + 16}
            cy={topTerminalY + 4}
            r={2.5}
            fill="white"
            stroke={stateColor}
            strokeWidth={1.5}
          />
        </>
      )}

      {/* Vertical line from pivot down to ground symbol */}
      <line
        x1={cx}
        y1={pivotY}
        x2={cx}
        y2={50}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* IEC Ground symbol: 3 horizontal lines, decreasing width */}
      <line
        x1={cx - 14}
        y1={50}
        x2={cx + 14}
        y2={50}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={cx - 9}
        y1={55}
        x2={cx + 9}
        y2={55}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={cx - 4}
        y1={60}
        x2={cx + 4}
        y2={60}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Label */}
      <text
        x={cx}
        y={74}
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
