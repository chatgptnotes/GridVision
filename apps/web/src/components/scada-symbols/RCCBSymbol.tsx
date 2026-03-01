import React from 'react';

interface RCCBSymbolProps {
  width?: number;
  height?: number;
  state?: 'ON' | 'OFF' | 'TRIPPED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function RCCBSymbol({
  width = 60,
  height = 80,
  state = 'OFF',
  color,
  onClick,
  label,
}: RCCBSymbolProps) {
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
      viewBox="0 0 60 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {state === 'TRIPPED' && (
        <style>
          {`
            @keyframes rccb-flash-border {
              0%, 100% { stroke-opacity: 1; }
              50% { stroke-opacity: 0.2; }
            }
            .rccb-tripped-border {
              animation: rccb-flash-border 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line */}
      <line
        x1={30} y1={0} x2={30} y2={16}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={30} cy={16} r={3} fill={stateColor} />

      {/* Bottom connection line */}
      <line
        x1={30} y1={60} x2={30} y2={80}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={30} cy={60} r={3} fill={stateColor} />

      {/* RCCB rectangular body */}
      <rect
        x={12} y={18} width={36} height={40}
        fill={state === 'ON' ? stateColor : 'none'}
        fillOpacity={state === 'ON' ? 0.08 : 0}
        stroke={stateColor}
        strokeWidth={2}
        rx={3}
        ry={3}
      />

      {/* RCD label inside */}
      <text
        x={30}
        y={26}
        textAnchor="middle"
        fill={stateColor}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        opacity={0.6}
      >
        RCD
      </text>

      {/* Test button circle */}
      <circle
        cx={42}
        cy={32}
        r={4}
        fill="none"
        stroke={stateColor}
        strokeWidth={1.5}
      />
      {/* "T" in test button */}
      <text
        x={42}
        y={34}
        textAnchor="middle"
        fill={stateColor}
        fontSize={5}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        T
      </text>

      {state === 'ON' && (
        <>
          {/* Toggle line pointing up (ON position) */}
          <line
            x1={30} y1={30} x2={30} y2={44}
            stroke={stateColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Toggle knob */}
          <circle cx={30} cy={30} r={3} fill={stateColor} />
          {/* Residual current sensing toroid */}
          <ellipse
            cx={30} cy={50}
            rx={10} ry={4}
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
          />
          {/* Connection stems */}
          <line
            x1={30} y1={16} x2={30} y2={18}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={58} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'OFF' && (
        <>
          {/* Toggle line pointing down (OFF position) */}
          <line
            x1={30} y1={32} x2={30} y2={46}
            stroke={stateColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Toggle knob */}
          <circle cx={30} cy={46} r={3} fill={stateColor} />
          {/* Residual current sensing toroid */}
          <ellipse
            cx={30} cy={50}
            rx={10} ry={4}
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
          />
          {/* Connection stems */}
          <line
            x1={30} y1={16} x2={30} y2={18}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={58} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'TRIPPED' && (
        <>
          {/* Flashing outer border */}
          <rect
            className="rccb-tripped-border"
            x={8} y={14} width={44} height={48}
            fill="none"
            stroke={stateColor}
            strokeWidth={2.5}
            strokeDasharray="4 2"
            rx={4}
          />
          {/* Toggle line in tripped position (angled) */}
          <line
            x1={30} y1={32} x2={22} y2={42}
            stroke={stateColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Toggle knob */}
          <circle cx={26} cy={38} r={3} fill={stateColor} />
          {/* Residual current sensing toroid */}
          <ellipse
            cx={30} cy={50}
            rx={10} ry={4}
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
          />
          {/* Connection stems */}
          <line
            x1={30} y1={16} x2={30} y2={18}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30} y1={58} x2={30} y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Exclamation indicator */}
          <text
            x={52}
            y={22}
            fill={stateColor}
            fontSize={12}
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            !
          </text>
        </>
      )}

      {/* Label */}
      <text
        x={30}
        y={75}
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
