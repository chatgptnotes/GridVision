import React from 'react';

interface VacuumCBSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED' | 'TRIPPED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function VacuumCBSymbol({
  width = 60,
  height = 80,
  state = 'OPEN',
  color,
  onClick,
  label,
}: VacuumCBSymbolProps) {
  const stateColor =
    color ||
    (state === 'CLOSED'
      ? '#16A34A'
      : state === 'TRIPPED'
        ? '#DC2626'
        : '#DC2626');

  const strokeWidth = 2.5;

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
            @keyframes vacuumcb-flash-border {
              0%, 100% { stroke-opacity: 1; }
              50% { stroke-opacity: 0.2; }
            }
            .vacuumcb-tripped-border {
              animation: vacuumcb-flash-border 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Top connection line */}
      <line
        x1={30} y1={0} x2={30} y2={18}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={30} cy={18} r={3} fill={stateColor} />

      {/* Bottom connection line */}
      <line
        x1={30} y1={62} x2={30} y2={80}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom terminal dot */}
      <circle cx={30} cy={62} r={3} fill={stateColor} />

      {/* Vacuum interrupter capsule/envelope */}
      <ellipse
        cx={30}
        cy={40}
        rx={14}
        ry={20}
        fill={state === 'CLOSED' ? stateColor : 'none'}
        fillOpacity={state === 'CLOSED' ? 0.08 : 0}
        stroke={stateColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Top contact stem */}
      <line
        x1={30} y1={18} x2={30} y2={32}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top contact plate */}
      <line
        x1={23} y1={32} x2={37} y2={32}
        stroke={stateColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {state === 'CLOSED' && (
        <>
          {/* Bottom contact plate (touching top) */}
          <line
            x1={23} y1={34} x2={37} y2={34}
            stroke={stateColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {/* Bottom contact stem */}
          <line
            x1={30} y1={34} x2={30} y2={62}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </>
      )}

      {state === 'OPEN' && (
        <>
          {/* Bottom contact plate (separated with gap) */}
          <line
            x1={23} y1={48} x2={37} y2={48}
            stroke={stateColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {/* Bottom contact stem */}
          <line
            x1={30} y1={48} x2={30} y2={62}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Gap indicator - small arc */}
          <path
            d="M 26 38 Q 30 42 34 38"
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      )}

      {state === 'TRIPPED' && (
        <>
          {/* Bottom contact plate (separated) */}
          <line
            x1={23} y1={48} x2={37} y2={48}
            stroke={stateColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {/* Bottom contact stem */}
          <line
            x1={30} y1={48} x2={30} y2={62}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Flashing border */}
          <ellipse
            className="vacuumcb-tripped-border"
            cx={30}
            cy={40}
            rx={18}
            ry={24}
            fill="none"
            stroke={stateColor}
            strokeWidth={2.5}
            strokeDasharray="4 2"
          />
          {/* Exclamation indicator */}
          <text
            x={52}
            y={28}
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
