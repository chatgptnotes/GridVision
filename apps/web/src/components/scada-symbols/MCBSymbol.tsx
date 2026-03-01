import React from 'react';

interface MCBSymbolProps {
  width?: number;
  height?: number;
  state?: 'ON' | 'OFF' | 'TRIPPED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function MCBSymbol({
  width = 50,
  height = 70,
  state = 'OFF',
  color,
  onClick,
  label,
}: MCBSymbolProps) {
  const stateColor =
    color ||
    (state === 'ON'
      ? '#16A34A'
      : state === 'TRIPPED'
        ? '#DC2626'
        : '#9CA3AF');

  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {state === 'TRIPPED' && (
        <style>
          {`
            @keyframes mcb-flash-border {
              0%, 100% { stroke-opacity: 1; }
              50% { stroke-opacity: 0.2; }
            }
            .mcb-tripped-border {
              animation: mcb-flash-border 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line */}
      <line
        x1={25} y1={0} x2={25} y2={14}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={25} cy={14} r={2.5} fill={stateColor} />

      {/* Bottom connection line */}
      <line
        x1={25} y1={52} x2={25} y2={62}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={25} cy={52} r={2.5} fill={stateColor} />

      {/* MCB rectangular body */}
      <rect
        x={12} y={16} width={26} height={34}
        fill={state === 'ON' ? stateColor : 'none'}
        fillOpacity={state === 'ON' ? 0.08 : 0}
        stroke={stateColor}
        strokeWidth={2}
        rx={3}
        ry={3}
      />

      {/* Toggle switch indicator */}
      {state === 'ON' && (
        <>
          {/* Toggle line pointing up (ON position) */}
          <line
            x1={25} y1={26} x2={25} y2={38}
            stroke={stateColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Toggle knob */}
          <circle cx={25} cy={26} r={3} fill={stateColor} />
          {/* ON indicator */}
          <text
            x={25}
            y={47}
            textAnchor="middle"
            fill={stateColor}
            fontSize={6}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            I
          </text>
          {/* Connection stems */}
          <line
            x1={25} y1={14} x2={25} y2={16}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={25} y1={50} x2={25} y2={52}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'OFF' && (
        <>
          {/* Toggle line pointing down (OFF position) */}
          <line
            x1={25} y1={28} x2={25} y2={40}
            stroke={stateColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Toggle knob */}
          <circle cx={25} cy={40} r={3} fill={stateColor} />
          {/* OFF indicator */}
          <text
            x={25}
            y={26}
            textAnchor="middle"
            fill={stateColor}
            fontSize={6}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            O
          </text>
          {/* Connection stems */}
          <line
            x1={25} y1={14} x2={25} y2={16}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={25} y1={50} x2={25} y2={52}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'TRIPPED' && (
        <>
          {/* Flashing outer border */}
          <rect
            className="mcb-tripped-border"
            x={9} y={13} width={32} height={40}
            fill="none"
            stroke={stateColor}
            strokeWidth={2}
            strokeDasharray="3 2"
            rx={4}
          />
          {/* Toggle line in middle (tripped position) */}
          <line
            x1={25} y1={28} x2={20} y2={38}
            stroke={stateColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Toggle knob */}
          <circle cx={22} cy={34} r={3} fill={stateColor} />
          {/* Connection stems */}
          <line
            x1={25} y1={14} x2={25} y2={16}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={25} y1={50} x2={25} y2={52}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Exclamation indicator */}
          <text
            x={42}
            y={22}
            fill={stateColor}
            fontSize={10}
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            !
          </text>
        </>
      )}

      {/* Label */}
      <text
        x={25}
        y={67}
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
