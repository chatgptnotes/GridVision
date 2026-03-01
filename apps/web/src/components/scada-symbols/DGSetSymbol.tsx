import React from 'react';

interface DGSetSymbolProps {
  width?: number;
  height?: number;
  state?: 'RUNNING' | 'STOPPED' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function DGSetSymbol({
  width = 100,
  height = 70,
  state = 'STOPPED',
  color,
  onClick,
  label,
}: DGSetSymbolProps) {
  const stateColor =
    color ||
    (state === 'RUNNING' ? '#16A34A' : state === 'FAULT' ? '#DC2626' : '#9CA3AF');

  const strokeWidth = 2;
  const labelColor = state === 'RUNNING' ? '#1E293B' : stateColor;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Diesel Generator Set (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Engine block — rectangle with piston symbol */}
      <rect
        x={4}
        y={10}
        width={38}
        height={36}
        rx={2}
        fill={stateColor}
        fillOpacity={0.1}
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Piston cylinder outline inside engine block */}
      <rect
        x={12}
        y={16}
        width={14}
        height={24}
        rx={1}
        fill="none"
        stroke={stateColor}
        strokeWidth={1.5}
      />

      {/* Piston head */}
      <rect
        x={13}
        y={state === 'RUNNING' ? 20 : 26}
        width={12}
        height={4}
        rx={0.5}
        fill={stateColor}
        fillOpacity={0.6}
      />

      {/* Connecting rod from piston */}
      <line
        x1={19}
        y1={state === 'RUNNING' ? 24 : 30}
        x2={19}
        y2={38}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Exhaust stack on top of engine */}
      <line
        x1={34}
        y1={10}
        x2={34}
        y2={4}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={31}
        y1={4}
        x2={37}
        y2={4}
        stroke={stateColor}
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* Coupling / shaft connecting engine to generator */}
      <line
        x1={42}
        y1={28}
        x2={52}
        y2={28}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Coupling detail */}
      <rect
        x={44}
        y={24}
        width={6}
        height={8}
        rx={1}
        fill={stateColor}
        fillOpacity={0.3}
        stroke={stateColor}
        strokeWidth={1}
      />

      {/* Generator circle */}
      <circle
        cx={68}
        cy={28}
        r={16}
        fill={stateColor}
        fillOpacity={0.08}
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* "G" letter inside generator */}
      <text
        x={68}
        y={33}
        textAnchor="middle"
        fill={stateColor}
        fontSize={14}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
      >
        G
      </text>

      {/* Output terminal on generator */}
      <line
        x1={84}
        y1={28}
        x2={96}
        y2={28}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx={96} cy={28} r={2} fill={stateColor} />

      {/* Running indicator: small animated chevrons for exhaust */}
      {state === 'RUNNING' && (
        <>
          <style>
            {`
              @keyframes dg-exhaust {
                0% { opacity: 0.3; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-4px); }
              }
              .dg-exhaust-1 { animation: dg-exhaust 1s ease-out infinite; }
              .dg-exhaust-2 { animation: dg-exhaust 1s ease-out 0.3s infinite; }
            `}
          </style>
          <text
            className="dg-exhaust-1"
            x={32}
            y={3}
            textAnchor="middle"
            fill={stateColor}
            fontSize={6}
            fontFamily="Arial, sans-serif"
          >
            ~
          </text>
          <text
            className="dg-exhaust-2"
            x={36}
            y={3}
            textAnchor="middle"
            fill={stateColor}
            fontSize={6}
            fontFamily="Arial, sans-serif"
          >
            ~
          </text>
        </>
      )}

      {/* Fault indicator */}
      {state === 'FAULT' && (
        <>
          <style>
            {`
              @keyframes dg-fault-flash {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.2; }
              }
              .dg-fault-indicator {
                animation: dg-fault-flash 0.8s ease-in-out infinite;
              }
            `}
          </style>
          <text
            className="dg-fault-indicator"
            x={68}
            y={8}
            textAnchor="middle"
            fill="#DC2626"
            fontSize={12}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            !
          </text>
        </>
      )}

      {/* Base line */}
      <line
        x1={4}
        y1={48}
        x2={84}
        y2={48}
        stroke={stateColor}
        strokeWidth={1}
        strokeOpacity={0.4}
      />

      {/* Label text */}
      <text
        x={50}
        y={62}
        textAnchor="middle"
        fill={labelColor}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || `DG SET`}
      </text>

      {/* State indicator text */}
      <text
        x={50}
        y={70}
        textAnchor="middle"
        fill={stateColor}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
      >
        {state}
      </text>
    </svg>
  );
}
