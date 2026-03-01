import React from 'react';

interface SolarPanelSymbolProps {
  width?: number;
  height?: number;
  state?: 'GENERATING' | 'IDLE' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SolarPanelSymbol({
  width = 60,
  height = 60,
  state = 'GENERATING',
  color,
  onClick,
  label,
  className,
  rotation,
}: SolarPanelSymbolProps) {
  const stateColor =
    color ||
    (state === 'GENERATING'
      ? '#16A34A'
      : state === 'IDLE'
        ? '#9CA3AF'
        : '#DC2626');

  const strokeWidth = 2;
  const labelColor = state === 'IDLE' ? '#9CA3AF' : '#1E293B';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Solar Panel (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-pv {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .pv-fault-flash {
              animation: fault-flash-pv 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line */}
      <line
        x1={30}
        y1={0}
        x2={30}
        y2={6}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Top terminal dot */}
      <circle cx={30} cy={3} r={3} fill={stateColor} />

      {/* Main panel rectangle */}
      <rect
        className={state === 'FAULT' ? 'pv-fault-flash' : undefined}
        x={8}
        y={6}
        width={44}
        height={34}
        rx={2}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        fill={stateColor}
        fillOpacity={0.08}
      />

      {/* 3x3 grid lines inside panel — vertical lines */}
      <line
        x1={22.67}
        y1={6}
        x2={22.67}
        y2={40}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.5}
      />
      <line
        x1={37.33}
        y1={6}
        x2={37.33}
        y2={40}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.5}
      />

      {/* 3x3 grid lines inside panel — horizontal lines */}
      <line
        x1={8}
        y1={17.33}
        x2={52}
        y2={17.33}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.5}
      />
      <line
        x1={8}
        y1={28.67}
        x2={52}
        y2={28.67}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.5}
      />

      {/* Sun rays symbol on top-right corner */}
      {state === 'GENERATING' && (
        <g opacity={0.8}>
          {/* Sun circle */}
          <circle cx={50} cy={10} r={3} fill="#CA8A04" stroke="#CA8A04" strokeWidth={0.5} />
          {/* Ray lines */}
          <line x1={50} y1={5} x2={50} y2={3} stroke="#CA8A04" strokeWidth={1} strokeLinecap="round" />
          <line x1={50} y1={15} x2={50} y2={17} stroke="#CA8A04" strokeWidth={1} strokeLinecap="round" />
          <line x1={45} y1={10} x2={43} y2={10} stroke="#CA8A04" strokeWidth={1} strokeLinecap="round" />
          <line x1={55} y1={10} x2={57} y2={10} stroke="#CA8A04" strokeWidth={1} strokeLinecap="round" />
          <line x1={46.5} y1={6.5} x2={45} y2={5} stroke="#CA8A04" strokeWidth={1} strokeLinecap="round" />
          <line x1={53.5} y1={13.5} x2={55} y2={15} stroke="#CA8A04" strokeWidth={1} strokeLinecap="round" />
          <line x1={53.5} y1={6.5} x2={55} y2={5} stroke="#CA8A04" strokeWidth={1} strokeLinecap="round" />
          <line x1={46.5} y1={13.5} x2={45} y2={15} stroke="#CA8A04" strokeWidth={1} strokeLinecap="round" />
        </g>
      )}

      {/* "PV" text inside panel */}
      <text
        x={30}
        y={26}
        fontSize={10}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        PV
      </text>

      {/* Diode symbol at bottom (triangle + line) */}
      <polygon
        points="25,42 35,42 30,48"
        fill={stateColor}
        fillOpacity={0.4}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <line
        x1={25}
        y1={48}
        x2={35}
        y2={48}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Bottom connection line */}
      <line
        x1={30}
        y1={48}
        x2={30}
        y2={52}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Bottom terminal dot */}
      <circle cx={30} cy={52} r={3} fill={stateColor} />

      {/* Label text */}
      <text
        x={30}
        y={59}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
        fill={labelColor}
        textAnchor="middle"
      >
        {label || state}
      </text>
    </svg>
  );
}
