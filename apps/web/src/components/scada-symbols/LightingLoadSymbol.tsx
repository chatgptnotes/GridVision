import React from 'react';
interface Props { width?: number; height?: number; state?: string; color?: string; label?: string; rotation?: number; }
export default function LightingLoadSymbol({ width = 60, height = 60, state = 'ON', color, label, rotation }: Props) {
  const c = color || (state === 'ON' ? '#EAB308' : state === 'FAULT' ? '#DC2626' : '#9CA3AF');
  return (
    <svg width={width} height={height} viewBox="0 0 60 60" style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}>
      <circle cx="30" cy="28" r="18" fill={state === 'ON' ? '#FEF3C7' : 'none'} stroke={c} strokeWidth="2" />
      {/* X inside = lighting */}
      <line x1="20" y1="18" x2="40" y2="38" stroke={c} strokeWidth="2" />
      <line x1="40" y1="18" x2="20" y2="38" stroke={c} strokeWidth="2" />
      <line x1="30" y1="46" x2="30" y2="56" stroke={c} strokeWidth="2" />
      {label && <text x="30" y="56" textAnchor="middle" fontSize="8" fill="#666">{label}</text>}
    </svg>
  );
}
