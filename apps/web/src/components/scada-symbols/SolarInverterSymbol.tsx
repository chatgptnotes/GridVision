import React from 'react';

interface SolarInverterSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'STANDBY' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SolarInverterSymbol({
  width = 70,
  height = 60,
  state = 'ACTIVE',
  color,
  onClick,
  label,
  className,
  rotation,
}: SolarInverterSymbolProps) {
  const stateColor =
    color ||
    (state === 'ACTIVE'
      ? '#16A34A'
      : state === 'STANDBY'
        ? '#9CA3AF'
        : '#DC2626');

  const strokeWidth = 2;
  const labelColor = state === 'STANDBY' ? '#9CA3AF' : '#1E293B';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 70 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Solar Inverter (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-sinv {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .sinv-fault-flash {
              animation: fault-flash-sinv 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Left connection line (DC input) */}
      <line
        x1={0}
        y1={25}
        x2={10}
        y2={25}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Left terminal dot */}
      <circle cx={3} cy={25} r={3} fill={stateColor} />

      {/* "DC" label on left */}
      <text
        x={5}
        y={18}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
      >
        DC
      </text>

      {/* Main inverter rectangle */}
      <rect
        className={state === 'FAULT' ? 'sinv-fault-flash' : undefined}
        x={10}
        y={8}
        width={50}
        height={34}
        rx={3}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        fill={stateColor}
        fillOpacity={0.06}
      />

      {/* DC side indicator — straight line (left half of rectangle) */}
      <line
        x1={16}
        y1={25}
        x2={28}
        y2={25}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Conversion arrow */}
      <polygon
        points="30,22 34,25 30,28"
        fill={stateColor}
        fillOpacity={0.6}
      />

      {/* AC side indicator — sine wave (right half of rectangle) */}
      <path
        d="M 36,25 Q 39,19 42,25 Q 45,31 48,25 Q 51,19 54,25"
        stroke={stateColor}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* "MPPT" label inside rectangle */}
      <text
        x={35}
        y={17}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        MPPT
      </text>

      {/* Right connection line (AC output) */}
      <line
        x1={60}
        y1={25}
        x2={70}
        y2={25}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Right terminal dot */}
      <circle cx={67} cy={25} r={3} fill={stateColor} />

      {/* "AC" label on right */}
      <text
        x={65}
        y={18}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
      >
        AC
      </text>

      {/* Label text */}
      <text
        x={35}
        y={50}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
        fill={labelColor}
        textAnchor="middle"
      >
        {label || state}
      </text>

      {/* State indicator text */}
      <text
        x={35}
        y={58}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
        fill={stateColor}
        textAnchor="middle"
      >
        {state}
      </text>
    </svg>
  );
}
