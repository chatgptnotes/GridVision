import React from 'react';

interface ContactorSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function ContactorSymbol({
  width = 60,
  height = 80,
  state = 'OPEN',
  color,
  onClick,
  label,
}: ContactorSymbolProps) {
  const stateColor =
    color || (state === 'OPEN' ? '#16A34A' : '#DC2626');

  const strokeWidth = 2.5;
  const cx = 30;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={16}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal */}
      <circle cx={cx} cy={16} r={3} fill={stateColor} />

      {/* Bottom terminal */}
      <circle cx={cx} cy={44} r={3} fill={stateColor} />

      {state === 'CLOSED' ? (
        <>
          {/* Closed: contacts touching - two parallel lines with bridge */}
          {/* Fixed contact (top) */}
          <line
            x1={cx - 10}
            y1={22}
            x2={cx + 10}
            y2={22}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Moving contact (bottom) */}
          <line
            x1={cx - 10}
            y1={38}
            x2={cx + 10}
            y2={38}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Bridge connecting both contacts (closed) */}
          <line
            x1={cx}
            y1={16}
            x2={cx}
            y2={22}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={cx}
            y1={22}
            x2={cx}
            y2={38}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={cx}
            y1={38}
            x2={cx}
            y2={44}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      ) : (
        <>
          {/* Open: contacts separated, moving contact tilted */}
          {/* Fixed contact (bottom) */}
          <line
            x1={cx - 10}
            y1={38}
            x2={cx + 10}
            y2={38}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={cx}
            y1={38}
            x2={cx}
            y2={44}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Fixed contact (top) - open circle indicating gap */}
          <circle
            cx={cx}
            cy={22}
            r={3}
            fill="white"
            stroke={stateColor}
            strokeWidth={1.5}
          />
          <line
            x1={cx}
            y1={16}
            x2={cx}
            y2={19}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Moving contact: tilted blade from bottom contact going up-right */}
          <line
            x1={cx}
            y1={38}
            x2={cx + 14}
            y2={24}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </>
      )}

      {/* Magnetic coil indicator: half-circle (arc) at bottom */}
      <line
        x1={cx}
        y1={44}
        x2={cx}
        y2={50}
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />
      {/* Coil semicircle */}
      <path
        d={`M ${cx - 10} 50 A 10 10 0 0 1 ${cx + 10} 50`}
        fill={state === 'CLOSED' ? stateColor : 'none'}
        fillOpacity={state === 'CLOSED' ? 0.2 : 0}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Second arc for coil representation */}
      <path
        d={`M ${cx - 7} 50 A 7 6 0 0 0 ${cx + 7} 50`}
        fill="none"
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Bottom connection line from coil */}
      <line
        x1={cx}
        y1={56}
        x2={cx}
        y2={68}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Label */}
      <text
        x={cx}
        y={76}
        textAnchor="middle"
        fill={stateColor}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || state}
      </text>
    </svg>
  );
}
