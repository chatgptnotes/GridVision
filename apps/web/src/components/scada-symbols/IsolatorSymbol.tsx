import React from 'react';

interface IsolatorSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function IsolatorSymbol({
  width = 50,
  height = 70,
  state = 'OPEN',
  color,
  onClick,
  label,
}: IsolatorSymbolProps) {
  const stateColor =
    color || (state === 'OPEN' ? '#16A34A' : '#DC2626');

  const strokeWidth = 2.5;
  const cx = 25; // center x
  const topTerminalY = 18;
  const bottomTerminalY = 52;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 70"
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

      {/* Bottom connection line */}
      <line
        x1={cx}
        y1={bottomTerminalY}
        x2={cx}
        y2={70}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal: fixed contact (filled circle) */}
      <circle cx={cx} cy={bottomTerminalY} r={3.5} fill={stateColor} />

      {state === 'CLOSED' ? (
        <>
          {/* Closed: vertical blade connecting both terminals */}
          <line
            x1={cx}
            y1={topTerminalY}
            x2={cx}
            y2={bottomTerminalY}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Top terminal: filled circle (closed contact) */}
          <circle cx={cx} cy={topTerminalY} r={3.5} fill={stateColor} />
        </>
      ) : (
        <>
          {/* Open: blade rotated to the side (pivot at bottom terminal) */}
          <line
            x1={cx}
            y1={bottomTerminalY}
            x2={cx - 16}
            y2={topTerminalY + 2}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Top terminal: open circle (disconnected) */}
          <circle
            cx={cx}
            cy={topTerminalY}
            r={3.5}
            fill="white"
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Moving end: open circle */}
          <circle
            cx={cx - 16}
            cy={topTerminalY + 2}
            r={3}
            fill="white"
            stroke={stateColor}
            strokeWidth={1.5}
          />
        </>
      )}

      {/* Label */}
      <text
        x={cx}
        y={66}
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
