import React from 'react';

interface STATCOMSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'STANDBY' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function STATCOMSymbol({
  width = 70,
  height = 80,
  state = 'STANDBY',
  color,
  onClick,
  label,
}: STATCOMSymbolProps) {
  const stateColor =
    color ||
    (state === 'ACTIVE'
      ? '#16A34A'
      : state === 'FAULT'
        ? '#DC2626'
        : '#9CA3AF');

  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes statcom-fault-flash {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .statcom-fault-flash {
              animation: statcom-fault-flash 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line (to grid) */}
      <line
        x1={35} y1={0} x2={35} y2={10}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={35} cy={3} r={3} fill={stateColor} />

      {/* === Coupling Transformer === */}
      {/* Primary winding (top coil) */}
      <circle
        cx={35}
        cy={18}
        r={8}
        fill="none"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Secondary winding (bottom coil, overlapping) */}
      <circle
        cx={35}
        cy={30}
        r={8}
        fill="none"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Connection line from transformer to VSC */}
      <line
        x1={35} y1={38} x2={35} y2={44}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* === Voltage Source Converter (VSC) rectangle === */}
      <rect
        className={state === 'FAULT' ? 'statcom-fault-flash' : undefined}
        x={15}
        y={44}
        width={40}
        height={22}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        rx={2}
      />

      {/* "~" (AC) symbol inside VSC */}
      <path
        d="M 25,55 Q 30,49 35,55 Q 40,61 45,55"
        fill="none"
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* "=" (DC) bus symbol: two horizontal lines on right side of VSC */}
      <line
        x1={55} y1={52} x2={62} y2={52}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={55} y1={56} x2={62} y2={56}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* DC capacitor on right side */}
      {/* Upper plate */}
      <line
        x1={60} y1={48} x2={66} y2={48}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Lower plate */}
      <line
        x1={60} y1={62} x2={66} y2={62}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Capacitor leads */}
      <line
        x1={63} y1={44} x2={63} y2={48}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={63} y1={62} x2={63} y2={66}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Bottom connection line from VSC */}
      <line
        x1={35} y1={66} x2={35} y2={72}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={35} cy={72} r={3} fill={stateColor} />

      {/* Ground symbol at bottom */}
      <line
        x1={28} y1={72} x2={42} y2={72}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={30} y1={75} x2={40} y2={75}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={33} y1={78} x2={37} y2={78}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
      />

      {/* "STATCOM" label */}
      <text
        x={35}
        y={42}
        textAnchor="middle"
        fill={stateColor}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        STATCOM
      </text>

      {/* State / label text */}
      <text
        x={10}
        y={58}
        fill={stateColor}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        textAnchor="middle"
      >
        {label || state}
      </text>
    </svg>
  );
}
