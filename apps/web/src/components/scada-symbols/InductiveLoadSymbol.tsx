import React from 'react';
interface Props { width?: number; height?: number; state?: string; color?: string; label?: string; rotation?: number; }
export default function InductiveLoadSymbol({ width = 60, height = 60, state = 'ON', color, label, rotation }: Props) {
  const c = color || (state === 'ON' ? '#3B82F6' : state === 'FAULT' ? '#DC2626' : '#9CA3AF');
  return (
    <svg width={width} height={height} viewBox="0 0 60 60" style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}>
      <circle cx="30" cy="30" r="24" fill="none" stroke={c} strokeWidth="2" />
      {/* Coil/inductor arcs */}
      <path d="M18,30 Q22,18 26,30 Q30,42 34,30 Q38,18 42,30" fill="none" stroke={c} strokeWidth="2.5" />
      <line x1="10" y1="30" x2="18" y2="30" stroke={c} strokeWidth="2" />
      <line x1="42" y1="30" x2="50" y2="30" stroke={c} strokeWidth="2" />
      {label && <text x="30" y="56" textAnchor="middle" fontSize="8" fill="#666">{label}</text>}
    </svg>
  );
}
