import React from 'react';
interface Props { width?: number; height?: number; state?: string; color?: string; label?: string; rotation?: number; }
export default function ResistiveLoadSymbol({ width = 60, height = 60, state = 'ON', color, label, rotation }: Props) {
  const c = color || (state === 'ON' ? '#F59E0B' : state === 'FAULT' ? '#DC2626' : '#9CA3AF');
  return (
    <svg width={width} height={height} viewBox="0 0 60 60" style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}>
      {/* Zigzag resistor symbol inside circle */}
      <circle cx="30" cy="30" r="24" fill="none" stroke={c} strokeWidth="2" />
      <polyline points="18,30 22,20 26,40 30,20 34,40 38,20 42,30" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round" />
      {/* Connection points */}
      <line x1="10" y1="30" x2="18" y2="30" stroke={c} strokeWidth="2" />
      <line x1="42" y1="30" x2="50" y2="30" stroke={c} strokeWidth="2" />
      {label && <text x="30" y="56" textAnchor="middle" fontSize="8" fill="#666">{label}</text>}
    </svg>
  );
}
