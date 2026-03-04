import React from 'react';
interface Props { width?: number; height?: number; state?: string; color?: string; label?: string; rotation?: number; }
export default function HeatingLoadSymbol({ width = 60, height = 60, state = 'ON', color, label, rotation }: Props) {
  const c = color || (state === 'ON' ? '#EF4444' : state === 'FAULT' ? '#DC2626' : '#9CA3AF');
  return (
    <svg width={width} height={height} viewBox="0 0 60 60" style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}>
      <rect x="10" y="15" width="40" height="30" rx="4" fill={state === 'ON' ? '#FEE2E2' : 'none'} stroke={c} strokeWidth="2" />
      {/* Heat waves */}
      <path d="M20,22 Q23,18 20,14" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M30,22 Q33,18 30,14" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M40,22 Q43,18 40,14" fill="none" stroke={c} strokeWidth="1.5" />
      {/* Zigzag element inside */}
      <polyline points="15,30 20,24 25,36 30,24 35,36 40,24 45,30" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <line x1="30" y1="45" x2="30" y2="56" stroke={c} strokeWidth="2" />
      {label && <text x="30" y="56" textAnchor="middle" fontSize="8" fill="#666">{label}</text>}
    </svg>
  );
}
