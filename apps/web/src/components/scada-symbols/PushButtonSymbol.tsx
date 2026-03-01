import React from 'react';

interface PushButtonSymbolProps {
  width?: number;
  height?: number;
  state?: 'PRESSED' | 'RELEASED';
  contactType?: 'NO' | 'NC';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function PushButtonSymbol({
  width = 40,
  height = 50,
  state = 'RELEASED',
  contactType = 'NO',
  color,
  onClick,
  label,
  className,
  rotation = 0,
}: PushButtonSymbolProps) {
  const isPressed = state === 'PRESSED';
  const stateColor = color || (isPressed ? '#16A34A' : '#9CA3AF');
  const strokeWidth = 2;

  // Inner circle offset when pressed
  const innerOffset = isPressed ? 2 : 0;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 50"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={label || `Push Button ${contactType} (${state})`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top connection line */}
      <line
        x1={20}
        y1={0}
        x2={20}
        y2={8}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Top connection terminal */}
      <circle cx={20} cy={8} r={1.5} fill="#1F2937" />

      {/* Outer circle (button housing) */}
      <circle
        cx={20}
        cy={22}
        r={12}
        fill="none"
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Inner circle (button face) - shifts down when pressed */}
      <circle
        cx={20}
        cy={22 + innerOffset}
        r={7}
        fill={stateColor}
        fillOpacity={isPressed ? 0.6 : 0.2}
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Press indicator dot at center */}
      <circle
        cx={20}
        cy={22 + innerOffset}
        r={2}
        fill={stateColor}
        fillOpacity={isPressed ? 1 : 0.5}
      />

      {/* Bottom connection terminal */}
      <circle cx={20} cy={36} r={1.5} fill="#1F2937" />

      {/* Bottom connection line */}
      <line
        x1={20}
        y1={36}
        x2={20}
        y2={42}
        stroke="#1F2937"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Contact type label (NO or NC) */}
      <text
        x={20}
        y={48}
        textAnchor="middle"
        fill="#6B7280"
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {contactType}
      </text>

      {/* Label text */}
      <text
        x={20}
        y={22 + innerOffset + 1}
        textAnchor="middle"
        fill={isPressed ? '#FFFFFF' : '#6B7280'}
        fontSize={4}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        dominantBaseline="middle"
      >
        {label || state}
      </text>
    </svg>
  );
}
