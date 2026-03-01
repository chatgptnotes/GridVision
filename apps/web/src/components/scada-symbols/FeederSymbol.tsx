import React from 'react';

interface FeederSymbolProps {
  width?: number;
  height?: number;
  direction?: 'incoming' | 'outgoing';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function FeederSymbol({
  width = 60,
  height = 50,
  direction = 'incoming',
  color = '#374151',
  onClick,
  label,
}: FeederSymbolProps) {
  const strokeWidth = 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Arrowhead marker for direction indication */}
        <marker
          id="feeder-arrow"
          viewBox="0 0 10 8"
          refX={9}
          refY={4}
          markerWidth={8}
          markerHeight={6}
          orient="auto-start-reverse"
          fill={color}
        >
          <path d="M 0 0 L 10 4 L 0 8 Z" />
        </marker>
      </defs>

      {/* T-shaped tower representation — overhead line tower */}
      {/* Tower vertical pole */}
      <line
        x1={30}
        y1={4}
        x2={30}
        y2={22}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Tower horizontal crossarm */}
      <line
        x1={16}
        y1={4}
        x2={44}
        y2={4}
        stroke={color}
        strokeWidth={strokeWidth + 0.5}
        strokeLinecap="round"
      />
      {/* Left insulator */}
      <circle cx={18} cy={4} r={1.5} fill={color} />
      {/* Right insulator */}
      <circle cx={42} cy={4} r={1.5} fill={color} />
      {/* Center insulator */}
      <circle cx={30} cy={4} r={1.5} fill={color} />

      {/* Overhead line — vertical feeder line below tower */}
      <line
        x1={30}
        y1={22}
        x2={30}
        y2={44}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Direction arrow alongside the feeder line */}
      {direction === 'incoming' && (
        <>
          {/* Arrow pointing downward (power coming in) */}
          <line
            x1={44}
            y1={16}
            x2={44}
            y2={36}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            markerEnd="url(#feeder-arrow)"
          />
        </>
      )}

      {direction === 'outgoing' && (
        <>
          {/* Arrow pointing upward (power going out) */}
          <line
            x1={44}
            y1={36}
            x2={44}
            y2={16}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            markerEnd="url(#feeder-arrow)"
          />
        </>
      )}

      {/* Bottom terminal dot */}
      <circle cx={30} cy={44} r={2.5} fill={color} />

      {/* Label */}
      {label && (
        <text
          x={30}
          y={49}
          textAnchor="middle"
          fill={color}
          fontSize={7}
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
