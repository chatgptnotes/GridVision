import React from 'react';

interface MCCBSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED' | 'TRIPPED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function MCCBSymbol({
  width = 60,
  height = 80,
  state = 'OPEN',
  color,
  onClick,
  label,
}: MCCBSymbolProps) {
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
            @keyframes mccb-flash-border {
              0%, 100% { stroke-opacity: 1; }
              50% { stroke-opacity: 0.2; }
            }
            .mccb-tripped-border {
              animation: mccb-flash-border 0.8s ease-in-out infinite;
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

      {/* Molded case - rounded rectangle */}
      <rect
        x={12} y={22} width={36} height={36}
        fill={state === 'CLOSED' ? stateColor : 'none'}
        fillOpacity={state === 'CLOSED' ? 0.1 : 0}
        stroke={stateColor}
        strokeWidth={2}
        rx={5}
        ry={5}
      />

      {/* "MCCB" label inside case */}
      <text
        x={30}
        y={30}
        textAnchor="middle"
        fill={stateColor}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        opacity={0.6}
      >
        MCCB
      </text>

      {state === 'CLOSED' && (
        <>
          {/* Breaker mechanism: contact line closed */}
          <line
            x1={30} y1={18} x2={30} y2={34}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Pivot point */}
          <circle cx={30} cy={40} r={3} fill="none" stroke={stateColor} strokeWidth={2} />
          {/* Closed contact arm */}
          <line
            x1={30} y1={34} x2={30} y2={46}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={30} y1={46} x2={30} y2={62}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Thermal trip element (bimetallic strip) */}
          <path
            d="M 24 46 Q 27 49 30 46 Q 33 43 36 46"
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      )}

      {state === 'OPEN' && (
        <>
          {/* Top contact stem */}
          <line
            x1={30} y1={18} x2={30} y2={34}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Pivot point */}
          <circle cx={30} cy={40} r={3} fill="none" stroke={stateColor} strokeWidth={2} />
          {/* Open contact arm (angled) */}
          <line
            x1={30} y1={34} x2={20} y2={42}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Bottom stem */}
          <line
            x1={30} y1={46} x2={30} y2={62}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Bottom contact point */}
          <circle cx={30} cy={46} r={2} fill={stateColor} />
          {/* Thermal trip element */}
          <path
            d="M 24 50 Q 27 53 30 50 Q 33 47 36 50"
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      )}

      {state === 'TRIPPED' && (
        <>
          {/* Flashing outer border */}
          <rect
            className="mccb-tripped-border"
            x={8} y={18} width={44} height={44}
            fill="none"
            stroke={stateColor}
            strokeWidth={2.5}
            strokeDasharray="4 2"
            rx={7}
          />
          {/* Top contact stem */}
          <line
            x1={30} y1={18} x2={30} y2={34}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Pivot point */}
          <circle cx={30} cy={40} r={3} fill={stateColor} fillOpacity={0.3} stroke={stateColor} strokeWidth={2} />
          {/* Tripped contact arm (angled further open) */}
          <line
            x1={30} y1={34} x2={18} y2={40}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Bottom stem */}
          <line
            x1={30} y1={46} x2={30} y2={62}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Bottom contact point */}
          <circle cx={30} cy={46} r={2} fill={stateColor} />
          {/* Thermal trip element */}
          <path
            d="M 24 50 Q 27 53 30 50 Q 33 47 36 50"
            fill="none"
            stroke={stateColor}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {/* Exclamation indicator */}
          <text
            x={50}
            y={26}
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
