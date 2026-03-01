import React from 'react';

interface RingMainUnitSymbolProps {
  width?: number;
  height?: number;
  state?: 'ENERGIZED' | 'DE_ENERGIZED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function RingMainUnitSymbol({
  width = 80,
  height = 80,
  state = 'DE_ENERGIZED',
  color,
  onClick,
  label,
}: RingMainUnitSymbolProps) {
  const stateColor =
    color ||
    (state === 'ENERGIZED' ? '#1E40AF' : '#9CA3AF');

  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main RMU rectangle */}
      <rect
        x={4} y={10} width={72} height={48}
        fill={state === 'ENERGIZED' ? stateColor : 'none'}
        fillOpacity={state === 'ENERGIZED' ? 0.08 : 0}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        rx={3}
        ry={3}
      />

      {/* Compartment dividers (3 compartments) */}
      <line
        x1={28} y1={10} x2={28} y2={58}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={52} y1={10} x2={52} y2={58}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Compartment 1: Switch (left) */}
      {/* Switch symbol: blade */}
      <line
        x1={16} y1={22} x2={16} y2={30}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={16} cy={22} r={2} fill={stateColor} />
      {state === 'ENERGIZED' ? (
        <line
          x1={16} y1={30} x2={16} y2={46}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ) : (
        <line
          x1={16} y1={30} x2={10} y2={42}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
      <circle cx={16} cy={46} r={2} fill={stateColor} />
      <line
        x1={16} y1={46} x2={16} y2={52}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* "SW" label */}
      <text
        x={16} y={18}
        textAnchor="middle"
        fill={stateColor}
        fontSize={5}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        opacity={0.7}
      >
        SW
      </text>

      {/* Compartment 2: Fuse-switch (center) */}
      {/* Switch blade */}
      <line
        x1={40} y1={22} x2={40} y2={28}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={40} cy={22} r={2} fill={stateColor} />
      {state === 'ENERGIZED' ? (
        <line
          x1={40} y1={28} x2={40} y2={38}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ) : (
        <line
          x1={40} y1={28} x2={34} y2={36}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
      {/* Fuse element */}
      <rect
        x={36} y={38} width={8} height={12}
        fill="none"
        stroke={stateColor}
        strokeWidth={1.5}
        rx={1}
      />
      {/* Fuse wire */}
      <line
        x1={40} y1={38} x2={40} y2={50}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
      />
      <circle cx={40} cy={52} r={2} fill={stateColor} />
      {/* "FS" label */}
      <text
        x={40} y={18}
        textAnchor="middle"
        fill={stateColor}
        fontSize={5}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        opacity={0.7}
      >
        FS
      </text>

      {/* Compartment 3: Switch (right) */}
      <line
        x1={64} y1={22} x2={64} y2={30}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={64} cy={22} r={2} fill={stateColor} />
      {state === 'ENERGIZED' ? (
        <line
          x1={64} y1={30} x2={64} y2={46}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ) : (
        <line
          x1={64} y1={30} x2={58} y2={42}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      )}
      <circle cx={64} cy={46} r={2} fill={stateColor} />
      <line
        x1={64} y1={46} x2={64} y2={52}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* "SW" label */}
      <text
        x={64} y={18}
        textAnchor="middle"
        fill={stateColor}
        fontSize={5}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        opacity={0.7}
      >
        SW
      </text>

      {/* Top busbar connection */}
      <line
        x1={16} y1={10} x2={16} y2={4}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={16} cy={4} r={2.5} fill={stateColor} />
      <line
        x1={64} y1={10} x2={64} y2={4}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={64} cy={4} r={2.5} fill={stateColor} />

      {/* Bottom cable connection (center fuse-switch) */}
      <line
        x1={40} y1={58} x2={40} y2={64}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={40} cy={64} r={2.5} fill={stateColor} />

      {/* "RMU" label */}
      <text
        x={40}
        y={75}
        textAnchor="middle"
        fill={stateColor}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || 'RMU'}
      </text>
    </svg>
  );
}
