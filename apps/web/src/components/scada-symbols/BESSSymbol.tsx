import React from 'react';

interface BESSSymbolProps {
  width?: number;
  height?: number;
  state?: 'CHARGING' | 'DISCHARGING' | 'STANDBY' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function BESSSymbol({
  width = 80,
  height = 60,
  state = 'STANDBY',
  color,
  onClick,
  label,
  className,
  rotation,
}: BESSSymbolProps) {
  const stateColor =
    color ||
    (state === 'CHARGING'
      ? '#16A34A'
      : state === 'DISCHARGING'
        ? '#CA8A04'
        : state === 'FAULT'
          ? '#DC2626'
          : '#9CA3AF');

  const strokeWidth = 2;
  const labelColor = state === 'STANDBY' ? '#9CA3AF' : '#1E293B';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Battery Energy Storage System (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-bess {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .bess-fault-flash {
              animation: fault-flash-bess 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Left connection line (grid/source side) */}
      <line
        x1={0}
        y1={24}
        x2={6}
        y2={24}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Left terminal dot */}
      <circle cx={3} cy={24} r={3} fill={stateColor} />

      {/* Main battery enclosure rectangle */}
      <rect
        className={state === 'FAULT' ? 'bess-fault-flash' : undefined}
        x={6}
        y={6}
        width={44}
        height={36}
        rx={3}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        fill={stateColor}
        fillOpacity={0.06}
      />

      {/* Battery symbol inside — positive plate (tall) */}
      <line
        x1={18}
        y1={14}
        x2={18}
        y2={34}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Battery symbol inside — negative plate (short) */}
      <line
        x1={24}
        y1={18}
        x2={24}
        y2={30}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Battery symbol inside — positive plate 2 */}
      <line
        x1={30}
        y1={14}
        x2={30}
        y2={34}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Battery symbol inside — negative plate 2 */}
      <line
        x1={36}
        y1={18}
        x2={36}
        y2={30}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* "+" label */}
      <text
        x={12}
        y={14}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
        textAnchor="middle"
      >
        +
      </text>
      {/* "-" label */}
      <text
        x={42}
        y={14}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
        textAnchor="middle"
      >
        -
      </text>

      {/* Bidirectional arrow between battery and inverter */}
      <line
        x1={50}
        y1={24}
        x2={56}
        y2={24}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Arrow right */}
      <polygon
        points="55,21 58,24 55,27"
        fill={stateColor}
        opacity={state === 'DISCHARGING' ? 1 : 0.3}
      />
      {/* Arrow left */}
      <polygon
        points="51,21 48,24 51,27"
        fill={stateColor}
        opacity={state === 'CHARGING' ? 1 : 0.3}
      />

      {/* Inverter box (smaller rectangle on right) */}
      <rect
        className={state === 'FAULT' ? 'bess-fault-flash' : undefined}
        x={56}
        y={12}
        width={18}
        height={24}
        rx={2}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        fill={stateColor}
        fillOpacity={0.06}
      />

      {/* Sine wave inside inverter box */}
      <path
        d="M 59,24 Q 62,19 65,24 Q 68,29 71,24"
        stroke={stateColor}
        strokeWidth={1.2}
        fill="none"
        strokeLinecap="round"
        opacity={state === 'STANDBY' ? 0.4 : 1}
      />

      {/* Right connection line (output) */}
      <line
        x1={74}
        y1={24}
        x2={80}
        y2={24}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Right terminal dot */}
      <circle cx={77} cy={24} r={3} fill={stateColor} />

      {/* Charging arrows (green, pointing into battery) */}
      {state === 'CHARGING' && (
        <g>
          <polygon
            points="10,20 14,24 10,28"
            fill="#16A34A"
            opacity={0.7}
          />
        </g>
      )}

      {/* Discharging arrows (yellow, pointing out of battery) */}
      {state === 'DISCHARGING' && (
        <g>
          <polygon
            points="44,20 48,24 44,28"
            fill="#CA8A04"
            opacity={0.7}
          />
        </g>
      )}

      {/* Fault flash indicator — lightning bolt */}
      {state === 'FAULT' && (
        <path
          className="bess-fault-flash"
          d="M 26,10 L 22,22 L 28,22 L 24,34"
          stroke="#DC2626"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* "BESS" label */}
      <text
        x={40}
        y={50}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={labelColor}
        textAnchor="middle"
      >
        {label || 'BESS'}
      </text>

      {/* State indicator text */}
      <text
        x={40}
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
