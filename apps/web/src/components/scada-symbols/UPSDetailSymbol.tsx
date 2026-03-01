import React from 'react';

interface UPSDetailSymbolProps {
  width?: number;
  height?: number;
  state?: 'ONLINE' | 'BATTERY' | 'BYPASS' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function UPSDetailSymbol({
  width = 100,
  height = 60,
  state = 'ONLINE',
  color,
  onClick,
  label,
}: UPSDetailSymbolProps) {
  const stateColor =
    color ||
    (state === 'ONLINE'
      ? '#16A34A'
      : state === 'BATTERY'
        ? '#CA8A04'
        : state === 'BYPASS'
          ? '#EA580C'
          : '#DC2626');

  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes ups-fault-flash-anim {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .ups-fault-flash {
              animation: ups-fault-flash-anim 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Left connection line (AC input) */}
      <line
        x1={0} y1={30} x2={8} y2={30}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Left terminal dot */}
      <circle cx={3} cy={30} r={3} fill={stateColor} />

      {/* Right connection line (AC output) */}
      <line
        x1={92} y1={30} x2={100} y2={30}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Right terminal dot */}
      <circle cx={97} cy={30} r={3} fill={stateColor} />

      {/* Main outer rectangle */}
      <rect
        className={state === 'FAULT' ? 'ups-fault-flash' : undefined}
        x={8}
        y={8}
        width={84}
        height={44}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        rx={3}
      />

      {/* Section dividers */}
      <line
        x1={36} y1={8} x2={36} y2={52}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
      <line
        x1={64} y1={8} x2={64} y2={52}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray="2 2"
      />

      {/* Section 1: Rectifier (left, 8-36) */}
      {/* Diode bridge simplified: diamond with small diode triangle */}
      <polygon
        points="22,18 28,24 22,24"
        fill={stateColor}
        stroke={stateColor}
        strokeWidth={1}
      />
      <line
        x1={19} y1={18} x2={25} y2={18}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* "AC" label in rectifier section */}
      <text
        x={11}
        y={34}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
      >
        AC
      </text>
      {/* Arrow indicating conversion direction */}
      <line
        x1={22} y1={30} x2={32} y2={30}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
      />
      <polygon
        points="30,28 34,30 30,32"
        fill={stateColor}
      />

      {/* Section 2: Battery (center, 36-64) */}
      {/* Battery symbol: long plate, short plate pairs */}
      <line
        x1={44} y1={22} x2={44} y2={38}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <line
        x1={48} y1={25} x2={48} y2={35}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={52} y1={22} x2={52} y2={38}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <line
        x1={56} y1={25} x2={56} y2={35}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* "+" and "-" signs */}
      <text
        x={40}
        y={21}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
      >
        +
      </text>
      <text
        x={57}
        y={21}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
      >
        -
      </text>

      {/* Section 3: Inverter (right, 64-92) */}
      {/* Triangle with sine wave */}
      <polygon
        points="68,20 82,30 68,40"
        fill="none"
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Small sine wave inside */}
      <path
        d="M 71,30 Q 74,26 77,30 Q 80,34 83,30"
        fill="none"
        stroke={stateColor}
        strokeWidth={1.2}
        strokeLinecap="round"
      />

      {/* Bypass path (dashed arc above main body) */}
      {state === 'BYPASS' && (
        <path
          d="M 12,8 Q 50,-6 88,8"
          fill="none"
          stroke={stateColor}
          strokeWidth={1.5}
          strokeDasharray="3 2"
          strokeLinecap="round"
        />
      )}

      {/* "UPS" label at top center */}
      <text
        x={50}
        y={48}
        textAnchor="middle"
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
      >
        UPS
      </text>

      {/* State / label at bottom */}
      <text
        x={50}
        y={58}
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
