import React from 'react';

interface SVCSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'STANDBY' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SVCSymbol({
  width = 70,
  height = 80,
  state = 'STANDBY',
  color,
  onClick,
  label,
}: SVCSymbolProps) {
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
            @keyframes svc-fault-flash {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .svc-fault-flash {
              animation: svc-fault-flash 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line */}
      <line
        x1={35} y1={0} x2={35} y2={10}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={35} cy={3} r={3} fill={stateColor} />

      {/* Top horizontal bus */}
      <line
        x1={15} y1={10} x2={55} y2={10}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* === Left branch: Thyristor-Controlled Reactor (TCR) === */}
      <g className={state === 'FAULT' ? 'svc-fault-flash' : undefined}>
        {/* Vertical line from top bus down to thyristor pair */}
        <line
          x1={22} y1={10} x2={22} y2={20}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Anti-parallel thyristor pair */}
        {/* Thyristor 1 (pointing down) */}
        <polygon
          points="17,20 27,20 22,28"
          fill={state === 'ACTIVE' ? stateColor : 'none'}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <line
          x1={17} y1={28} x2={27} y2={28}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Gate 1 */}
        <line
          x1={17} y1={24} x2={13} y2={22}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Thyristor 2 (pointing up, anti-parallel) */}
        <polygon
          points="17,36 27,36 22,28"
          fill={state === 'ACTIVE' ? stateColor : 'none'}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <line
          x1={17} y1={28} x2={27} y2={28}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Gate 2 */}
        <line
          x1={27} y1={32} x2={31} y2={34}
          stroke={stateColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Inductor/reactor coil below thyristors */}
        <line
          x1={22} y1={36} x2={22} y2={40}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Coil (3 half-circle arcs) */}
        <path
          d="M 22,40 A 4,4 0 0 0 22,48 A 4,4 0 0 0 22,56 A 4,4 0 0 0 22,64"
          fill="none"
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </g>

      {/* === Right branch: Capacitor bank (TSC) === */}
      <g className={state === 'FAULT' ? 'svc-fault-flash' : undefined}>
        {/* Vertical line from top bus down */}
        <line
          x1={48} y1={10} x2={48} y2={28}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Capacitor: two parallel plates */}
        {/* Upper plate (straight) */}
        <line
          x1={40} y1={28} x2={56} y2={28}
          stroke={stateColor}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Lower plate (curved, IEC standard) */}
        <path
          d="M 40,34 Q 48,38 56,34"
          fill="none"
          stroke={stateColor}
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Second capacitor element */}
        <line
          x1={48} y1={34} x2={48} y2={44}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1={40} y1={44} x2={56} y2={44}
          stroke={stateColor}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d="M 40,50 Q 48,54 56,50"
          fill="none"
          stroke={stateColor}
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Vertical line down from capacitor to bottom bus */}
        <line
          x1={48} y1={50} x2={48} y2={64}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </g>

      {/* Bottom horizontal bus */}
      <line
        x1={15} y1={64} x2={55} y2={64}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom connection line */}
      <line
        x1={35} y1={64} x2={35} y2={72}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={35} cy={72} r={3} fill={stateColor} />

      {/* "SVC" label */}
      <text
        x={35}
        y={78}
        textAnchor="middle"
        fill={stateColor}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        {label || 'SVC'}
      </text>

      {/* State indicator text (small, above bottom bus) */}
      <text
        x={35}
        y={62}
        textAnchor="middle"
        fill={stateColor}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
        opacity={0.8}
      >
        {state}
      </text>
    </svg>
  );
}
