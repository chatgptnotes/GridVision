import React from 'react';

interface StaticTransferSwitchSymbolProps {
  width?: number;
  height?: number;
  state?: 'SOURCE_A' | 'SOURCE_B' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function StaticTransferSwitchSymbol({
  width = 80,
  height = 60,
  state = 'SOURCE_A',
  color,
  onClick,
  label,
}: StaticTransferSwitchSymbolProps) {
  const stateColor =
    color ||
    (state === 'SOURCE_A'
      ? '#16A34A'
      : state === 'SOURCE_B'
        ? '#1E40AF'
        : '#DC2626');

  // Colors for individual sources
  const sourceAColor = state === 'SOURCE_A' ? '#16A34A' : '#9CA3AF';
  const sourceBColor = state === 'SOURCE_B' ? '#1E40AF' : '#9CA3AF';

  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes sts-fault-flash {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .sts-fault-flash {
              animation: sts-fault-flash 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Source A input line (top-left) */}
      <line
        x1={0} y1={15} x2={20} y2={15}
        stroke={sourceAColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Source A terminal dot */}
      <circle cx={3} cy={15} r={3} fill={sourceAColor} />

      {/* "A" label */}
      <text
        x={5}
        y={12}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={sourceAColor}
      >
        A
      </text>

      {/* Source B input line (bottom-left) */}
      <line
        x1={0} y1={45} x2={20} y2={45}
        stroke={sourceBColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Source B terminal dot */}
      <circle cx={3} cy={45} r={3} fill={sourceBColor} />

      {/* "B" label */}
      <text
        x={5}
        y={54}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={sourceBColor}
      >
        B
      </text>

      {/* Thyristor symbol for Source A path */}
      {/* Thyristor = diode triangle + gate bar */}
      <g className={state === 'FAULT' ? 'sts-fault-flash' : undefined}>
        {/* Source A path: line from input to junction */}
        <line
          x1={20} y1={15} x2={32} y2={15}
          stroke={sourceAColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Thyristor A triangle (pointing right) */}
        <polygon
          points="32,10 42,15 32,20"
          fill={state === 'SOURCE_A' ? sourceAColor : 'none'}
          stroke={sourceAColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Thyristor A cathode bar */}
        <line
          x1={42} y1={10} x2={42} y2={20}
          stroke={sourceAColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Thyristor A gate */}
        <line
          x1={37} y1={20} x2={37} y2={24}
          stroke={sourceAColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Source A converging line to output */}
        <line
          x1={42} y1={15} x2={55} y2={30}
          stroke={sourceAColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Source B path: line from input to junction */}
        <line
          x1={20} y1={45} x2={32} y2={45}
          stroke={sourceBColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Thyristor B triangle (pointing right) */}
        <polygon
          points="32,40 42,45 32,50"
          fill={state === 'SOURCE_B' ? sourceBColor : 'none'}
          stroke={sourceBColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {/* Thyristor B cathode bar */}
        <line
          x1={42} y1={40} x2={42} y2={50}
          stroke={sourceBColor}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Thyristor B gate */}
        <line
          x1={37} y1={36} x2={37} y2={40}
          stroke={sourceBColor}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Source B converging line to output */}
        <line
          x1={42} y1={45} x2={55} y2={30}
          stroke={sourceBColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </g>

      {/* Junction point */}
      <circle cx={55} cy={30} r={3} fill={stateColor} />

      {/* Output connection line */}
      <line
        x1={55} y1={30} x2={80} y2={30}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Output terminal dot */}
      <circle cx={77} cy={30} r={3} fill={stateColor} />

      {/* "STS" label */}
      <text
        x={55}
        y={10}
        textAnchor="middle"
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
      >
        STS
      </text>

      {/* Active source indicator */}
      {state === 'SOURCE_A' && (
        <circle cx={26} cy={15} r={2} fill={sourceAColor} opacity={0.6} />
      )}
      {state === 'SOURCE_B' && (
        <circle cx={26} cy={45} r={2} fill={sourceBColor} opacity={0.6} />
      )}

      {/* Label at bottom */}
      <text
        x={40}
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
