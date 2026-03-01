import React from 'react';

interface LoadBreakSwitchSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function LoadBreakSwitchSymbol({
  width = 60,
  height = 70,
  state = 'OPEN',
  color,
  onClick,
  label,
}: LoadBreakSwitchSymbolProps) {
  const stateColor =
    color || (state === 'OPEN' ? '#16A34A' : '#DC2626');

  const strokeWidth = 2.5;
  const cx = 30;
  const topTerminalY = 14;
  const bottomTerminalY = 48;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 70"
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
        y2={60}
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
        strokeWidth={state === 'CLOSED' ? 0 : strokeWidth}
      />

      {/* Bottom terminal (fixed pivot point) */}
      <circle cx={cx} cy={bottomTerminalY} r={3} fill={stateColor} />

      {state === 'CLOSED' ? (
        <>
          {/* Closed: vertical blade connecting terminals */}
          <line
            x1={cx}
            y1={topTerminalY}
            x2={cx}
            y2={bottomTerminalY}
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
            y1={bottomTerminalY}
            x2={cx - 16}
            y2={topTerminalY + 4}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Open end dot */}
          <circle
            cx={cx - 16}
            cy={topTerminalY + 4}
            r={2.5}
            fill="white"
            stroke={stateColor}
            strokeWidth={1.5}
          />
        </>
      )}

      {/* IEC Arc chamber: small rectangle on one side of the switch */}
      <rect
        x={cx + 6}
        y={topTerminalY + 6}
        width={10}
        height={bottomTerminalY - topTerminalY - 12}
        fill={state === 'CLOSED' ? stateColor : 'white'}
        fillOpacity={state === 'CLOSED' ? 0.12 : 1}
        stroke={stateColor}
        strokeWidth={1.8}
        rx={1.5}
      />
      {/* Arc chamber internal detail: zigzag line */}
      <polyline
        points={`${cx + 8},${topTerminalY + 10} ${cx + 14},${topTerminalY + 14} ${cx + 8},${topTerminalY + 18} ${cx + 14},${topTerminalY + 22} ${cx + 8},${topTerminalY + 26}`}
        fill="none"
        stroke={stateColor}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Connection from arc chamber to switch body */}
      <line
        x1={cx + 6}
        y1={(topTerminalY + bottomTerminalY) / 2}
        x2={cx + 3}
        y2={(topTerminalY + bottomTerminalY) / 2}
        stroke={stateColor}
        strokeWidth={1.5}
      />

      {/* Label */}
      <text
        x={cx}
        y={67}
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
