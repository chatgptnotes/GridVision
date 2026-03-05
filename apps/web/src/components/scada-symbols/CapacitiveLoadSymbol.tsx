import React from 'react';
interface Props { width?: number; height?: number; state?: string; color?: string; label?: string; rotation?: number; }
export default function CapacitiveLoadSymbol({ width = 60, height = 60, state = 'ON', color, label, rotation }: Props) {
  const c = color || (state === 'ON' ? '#8B5CF6' : state === 'FAULT' ? '#DC2626' : '#9CA3AF');
  return (
    <svg width={width} height={height} viewBox="0 0 60 60" style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}>
      <circle cx="30" cy="30" r="24" fill="none" stroke={c} strokeWidth="2" />
      {/* Capacitor parallel plates */}
      <line x1="10" y1="30" x2="26" y2="30" stroke={c} strokeWidth="2" />
      <line x1="26" y1="18" x2="26" y2="42" stroke={c} strokeWidth="3" />
      <line x1="34" y1="18" x2="34" y2="42" stroke={c} strokeWidth="3" />
      <line x1="34" y1="30" x2="50" y2="30" stroke={c} strokeWidth="2" />
      {label && <text x="30" y="56" textAnchor="middle" fontSize="8" fill="#666">{label}</text>}
    </svg>
  );
}
