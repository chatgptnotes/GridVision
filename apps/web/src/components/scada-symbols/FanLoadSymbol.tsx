import React from 'react';
interface Props { width?: number; height?: number; state?: string; color?: string; label?: string; rotation?: number; }
export default function FanLoadSymbol({ width = 60, height = 60, state = 'RUNNING', color, label, rotation }: Props) {
  const c = color || (state === 'RUNNING' ? '#06B6D4' : state === 'FAULT' ? '#DC2626' : '#9CA3AF');
  return (
    <svg width={width} height={height} viewBox="0 0 60 60" style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}>
      <circle cx="30" cy="30" r="24" fill="none" stroke={c} strokeWidth="2" />
      <circle cx="30" cy="30" r="4" fill={c} />
      {/* Fan blades */}
      <path d="M30,26 Q22,14 30,10 Q38,14 30,26" fill={c} opacity="0.6" />
      <path d="M34,30 Q46,22 50,30 Q46,38 34,30" fill={c} opacity="0.6" />
      <path d="M30,34 Q38,46 30,50 Q22,46 30,34" fill={c} opacity="0.6" />
      <path d="M26,30 Q14,38 10,30 Q14,22 26,30" fill={c} opacity="0.6" />
      {label && <text x="30" y="56" textAnchor="middle" fontSize="8" fill="#666">{label}</text>}
    </svg>
  );
}
