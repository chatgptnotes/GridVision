import React from 'react';

interface AVRSymbolProps {
  width?: number;
  height?: number;
  state?: 'AUTO' | 'MANUAL' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function AVRSymbol({
  width = 70,
  height = 50,
  state = 'AUTO',
  color,
  onClick,
  label,
}: AVRSymbolProps) {
  const indicatorColor =
    color ||
    (state === 'AUTO' ? '#16A34A' : state === 'MANUAL' ? '#EAB308' : '#DC2626');

  const borderColor = state === 'FAULT' ? '#DC2626' : '#475569';
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
      aria-label={label || `Automatic Voltage Regulator (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flashing style */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes avr-fault-flash {
              0%, 100% { stroke-opacity: 1; }
              50% { stroke-opacity: 0.3; }
            }
            .avr-fault-border {
              animation: avr-fault-flash 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Main enclosure rectangle */}
      <rect
        className={state === 'FAULT' ? 'avr-fault-border' : undefined}
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
        fill={indicatorColor}
      />

      {/* "AVR" label text */}
      <text
        x={14}
        y={16}
        fill={textColor}
        fontSize={10}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        AVR
      </text>

      {/* Voltage regulation symbol: V with up/down arrows */}
      {/* "V" character */}
      <text
        x={22}
        y={34}
        textAnchor="middle"
        fill={borderColor}
        fontSize={11}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        V
      </text>

      {/* Up arrow (voltage increase) */}
      <line
        x1={36}
        y1={32}
        x2={36}
        y2={22}
        stroke={indicatorColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <polyline
        points="33,25 36,22 39,25"
        fill="none"
        stroke={indicatorColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Down arrow (voltage decrease) */}
      <line
        x1={46}
        y1={22}
        x2={46}
        y2={32}
        stroke={indicatorColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <polyline
        points="43,29 46,32 49,29"
        fill="none"
        stroke={indicatorColor}
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
        fill={indicatorColor}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || state}
      </text>
    </svg>
  );
}
