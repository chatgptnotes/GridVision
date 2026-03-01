import React from 'react';

interface RectifierSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'STANDBY' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function RectifierSymbol({
  width = 60,
  height = 60,
  state = 'STANDBY',
  color,
  onClick,
  label,
}: RectifierSymbolProps) {
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
            @keyframes rectifier-fault-flash {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .rectifier-fault-flash {
              animation: rectifier-fault-flash 0.8s ease-in-out infinite;
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
        className={state === 'FAULT' ? 'rectifier-fault-flash' : undefined}
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

      {/* Bridge rectifier: 4 diodes in diamond arrangement */}
      {/* Center of diamond at (30, 30), diamond radius ~10 */}

      {/* Top diode (pointing right): from top to right */}
      <polygon
        points="30,18 36,24 30,24"
        fill={stateColor}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <line
        x1={30} y1={18} x2={36} y2={18}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Right diode (pointing down): from right to bottom */}
      <polygon
        points="36,24 42,30 36,30"
        fill={stateColor}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <line
        x1={42} y1={24} x2={42} y2={30}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Bottom diode (pointing left): from bottom to left */}
      <polygon
        points="30,42 30,36 24,36"
        fill={stateColor}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <line
        x1={24} y1={42} x2={30} y2={42}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Left diode (pointing up): from left to top */}
      <polygon
        points="24,36 18,30 24,30"
        fill={stateColor}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <line
        x1={18} y1={30} x2={18} y2={36}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Diamond connecting lines */}
      {/* Top to Right */}
      <line x1={30} y1={18} x2={42} y2={30} stroke={stateColor} strokeWidth={1.5} strokeLinecap="round" />
      {/* Right to Bottom */}
      <line x1={42} y1={30} x2={30} y2={42} stroke={stateColor} strokeWidth={1.5} strokeLinecap="round" />
      {/* Bottom to Left */}
      <line x1={30} y1={42} x2={18} y2={30} stroke={stateColor} strokeWidth={1.5} strokeLinecap="round" />
      {/* Left to Top */}
      <line x1={18} y1={30} x2={30} y2={18} stroke={stateColor} strokeWidth={1.5} strokeLinecap="round" />

      {/* AC input connection to bridge left midpoint */}
      <line x1={10} y1={30} x2={18} y2={30} stroke={stateColor} strokeWidth={strokeWidth} strokeLinecap="round" />

      {/* DC output connection from bridge right midpoint */}
      <line x1={42} y1={30} x2={50} y2={30} stroke={stateColor} strokeWidth={strokeWidth} strokeLinecap="round" />

      {/* "AC" label on left */}
      <text
        x={13}
        y={50}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
      >
        AC
      </text>

      {/* "DC" label on right */}
      <text
        x={47}
        y={50}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
      >
        DC
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
