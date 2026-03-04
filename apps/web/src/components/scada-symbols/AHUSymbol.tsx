import React from 'react';
interface Props { width?: number; height?: number; state?: string; color?: string; label?: string; rotation?: number; }
export default function AHUSymbol({ width = 80, height = 60, state = 'RUNNING', color, label, rotation }: Props) {
  const c = color || (state === 'RUNNING' ? '#0EA5E9' : state === 'FAULT' ? '#DC2626' : '#9CA3AF');
  return (
    <svg width={width} height={height} viewBox="0 0 80 60" style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}>
      <rect x="5" y="8" width="70" height="44" rx="4" fill="none" stroke={c} strokeWidth="2" />
      {/* Fan circle inside */}
      <circle cx="28" cy="30" r="14" fill="none" stroke={c} strokeWidth="1.5" />
      <circle cx="28" cy="30" r="3" fill={c} />
      <path d="M28,27 Q24,20 28,17 Q32,20 28,27" fill={c} opacity="0.5" />
      <path d="M31,30 Q38,26 41,30 Q38,34 31,30" fill={c} opacity="0.5" />
      <path d="M28,33 Q32,40 28,43 Q24,40 28,33" fill={c} opacity="0.5" />
      {/* Coil on right */}
      <line x1="50" y1="15" x2="50" y2="45" stroke={c} strokeWidth="1.5" />
      <line x1="55" y1="15" x2="55" y2="45" stroke={c} strokeWidth="1.5" />
      <line x1="60" y1="15" x2="60" y2="45" stroke={c} strokeWidth="1.5" />
      {/* Airflow arrows */}
      <line x1="65" y1="30" x2="78" y2="30" stroke={c} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="40" y="56" textAnchor="middle" fontSize="8" fontWeight="bold" fill={c}>AHU</text>
    </svg>
  );
}
