import React from 'react';

interface InverterSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'STANDBY' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function InverterSymbol({
  width = 60,
  height = 60,
  state = 'STANDBY',
  color,
  onClick,
  label,
}: InverterSymbolProps) {
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
      viewBox="0 0 60 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes inverter-fault-flash {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .inverter-fault-flash {
              animation: inverter-fault-flash 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Left connection line */}
      <line
        x1={0} y1={30} x2={10} y2={30}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Left terminal dot */}
      <circle cx={3} cy={30} r={3} fill={stateColor} />

      {/* Right connection line */}
      <line
        x1={50} y1={30} x2={60} y2={30}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Right terminal dot */}
      <circle cx={57} cy={30} r={3} fill={stateColor} />

      {/* Main rectangle */}
      <rect
        className={state === 'FAULT' ? 'inverter-fault-flash' : undefined}
        x={10}
        y={10}
        width={40}
        height={40}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        rx={2}
      />

      {/* Triangle symbol inside (pointing right, DC-to-AC conversion) */}
      <polygon
        points="22,20 40,30 22,40"
        fill="none"
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Sine wave symbol inside the triangle (AC output representation) */}
      <path
        d="M 28,30 Q 31,25 34,30 Q 37,35 40,30"
        fill="none"
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* "DC" label on left */}
      <text
        x={13}
        y={50}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
      >
        DC
      </text>

      {/* "AC" label on right */}
      <text
        x={47}
        y={50}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
      >
        AC
      </text>

      {/* Label at bottom */}
      <text
        x={30}
        y={57}
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
