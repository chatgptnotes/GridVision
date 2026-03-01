import React from 'react';

interface EnergyMeterSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function EnergyMeterSymbol({
  width = 50,
  height = 60,
  state = 'ACTIVE',
  color,
  onClick,
  label,
}: EnergyMeterSymbolProps) {
  const stateColor = color || (state === 'ACTIVE' ? '#1E40AF' : '#9CA3AF');
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Energy Meter (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main rectangle body */}
      <rect
        x={8}
        y={4}
        width={34}
        height={40}
        rx={3}
        fill="#FFFFFF"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* LCD display area on top */}
      <rect
        x={12}
        y={8}
        width={26}
        height={12}
        rx={1.5}
        fill={state === 'ACTIVE' ? '#ECFDF5' : '#F3F4F6'}
        stroke={stateColor}
        strokeWidth={1}
      />

      {/* Display reading lines */}
      <line
        x1={15}
        y1={12}
        x2={22}
        y2={12}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
      />
      <line
        x1={24}
        y1={12}
        x2={35}
        y2={12}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
      />
      <line
        x1={15}
        y1={16}
        x2={28}
        y2={16}
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
      />

      {/* "kWh" text */}
      <text
        x={25}
        y={30}
        textAnchor="middle"
        fill={stateColor}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        kWh
      </text>

      {/* Spinning disk indicator */}
      <circle
        cx={25}
        cy={38}
        r={4}
        fill="none"
        stroke={stateColor}
        strokeWidth={1}
      />
      {/* Sector fill on disk (rotation mark) */}
      <path
        d={`M 25 38 L 25 34 A 4 4 0 0 1 28.46 36.5 Z`}
        fill={state === 'ACTIVE' ? stateColor : '#D1D5DB'}
        fillOpacity={0.6}
      />

      {/* Left connection line */}
      <line
        x1={0}
        y1={24}
        x2={8}
        y2={24}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Left terminal dot */}
      <circle cx={0} cy={24} r={3} fill={stateColor} />

      {/* Right connection line */}
      <line
        x1={42}
        y1={24}
        x2={50}
        y2={24}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Right terminal dot */}
      <circle cx={50} cy={24} r={3} fill={stateColor} />

      {/* Label below */}
      <text
        x={25}
        y={55}
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
