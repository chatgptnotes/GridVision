import React from 'react';

interface CBSymbolProps {
  width?: number;
  height?: number;
  state?: 'OPEN' | 'CLOSED' | 'TRIPPED';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function CBSymbol({
  width = 60,
  height = 80,
  state = 'OPEN',
  color,
  onClick,
  label,
}: CBSymbolProps) {
  const stateColor =
    color ||
    (state === 'OPEN' ? '#16A34A' : '#DC2626');

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
      {/* Top connection line */}
      <line
        x1={30}
        y1={0}
        x2={30}
        y2={20}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Bottom connection line */}
      <line
        x1={30}
        y1={60}
        x2={30}
        y2={80}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top terminal dot */}
      <circle cx={30} cy={20} r={3} fill={stateColor} />

      {/* Bottom terminal dot */}
      <circle cx={30} cy={60} r={3} fill={stateColor} />

      {state === 'CLOSED' && (
        <>
          {/* IEC Closed Circuit Breaker: filled square with X cross */}
          <rect
            x={16}
            y={26}
            width={28}
            height={28}
            fill={stateColor}
            fillOpacity={0.15}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* X cross through square */}
          <line
            x1={16}
            y1={26}
            x2={44}
            y2={54}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={44}
            y1={26}
            x2={16}
            y2={54}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Connection from top terminal to square */}
          <line
            x1={30}
            y1={20}
            x2={30}
            y2={26}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Connection from square to bottom terminal */}
          <line
            x1={30}
            y1={54}
            x2={30}
            y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'OPEN' && (
        <>
          {/* IEC Open Circuit Breaker: square outline with gap */}
          <rect
            x={16}
            y={26}
            width={28}
            height={28}
            fill="none"
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Open gap representation: two short lines not meeting */}
          <line
            x1={16}
            y1={26}
            x2={26}
            y2={40}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={44}
            y1={54}
            x2={34}
            y2={40}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Connection from top terminal to square */}
          <line
            x1={30}
            y1={20}
            x2={30}
            y2={26}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Connection from square to bottom terminal */}
          <line
            x1={30}
            y1={54}
            x2={30}
            y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
        </>
      )}

      {state === 'TRIPPED' && (
        <>
          {/* Tripped state: red square with X and animated flashing border */}
          <style>
            {`
              @keyframes flash-border {
                0%, 100% { stroke-opacity: 1; }
                50% { stroke-opacity: 0.2; }
              }
              .cb-tripped-border {
                animation: flash-border 0.8s ease-in-out infinite;
              }
            `}
          </style>
          {/* Flashing outer border */}
          <rect
            className="cb-tripped-border"
            x={12}
            y={22}
            width={36}
            height={36}
            fill="none"
            stroke={stateColor}
            strokeWidth={3}
            strokeDasharray="4 2"
            rx={2}
          />
          {/* Inner filled square with X */}
          <rect
            x={16}
            y={26}
            width={28}
            height={28}
            fill={stateColor}
            fillOpacity={0.25}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={16}
            y1={26}
            x2={44}
            y2={54}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1={44}
            y1={26}
            x2={16}
            y2={54}
            stroke={stateColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Connection lines */}
          <line
            x1={30}
            y1={20}
            x2={30}
            y2={26}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          <line
            x1={30}
            y1={54}
            x2={30}
            y2={60}
            stroke={stateColor}
            strokeWidth={strokeWidth}
          />
          {/* Exclamation indicator */}
          <text
            x={50}
            y={30}
            fill={stateColor}
            fontSize={12}
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            !
          </text>
        </>
      )}

      {/* State label below */}
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
