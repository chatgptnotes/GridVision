import React from 'react';
interface Props { width?: number; height?: number; state?: string; color?: string; label?: string; rotation?: number; }
export default function ChillerSymbol({ width = 80, height = 60, state = 'RUNNING', color, label, rotation }: Props) {
  const c = color || (state === 'RUNNING' ? '#2563EB' : state === 'FAULT' ? '#DC2626' : '#9CA3AF');
  return (
    <svg width={width} height={height} viewBox="0 0 80 60" style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}>
      <rect x="5" y="10" width="70" height="40" rx="6" fill={state === 'RUNNING' ? '#EFF6FF' : 'none'} stroke={c} strokeWidth="2" />
      {/* Snowflake / cooling symbol */}
      <line x1="40" y1="18" x2="40" y2="42" stroke={c} strokeWidth="2" />
      <line x1="28" y1="24" x2="52" y2="36" stroke={c} strokeWidth="2" />
      <line x1="52" y1="24" x2="28" y2="36" stroke={c} strokeWidth="2" />
      {/* Small ticks on lines */}
      <line x1="37" y1="19" x2="40" y2="22" stroke={c} strokeWidth="1.5" />
      <line x1="43" y1="19" x2="40" y2="22" stroke={c} strokeWidth="1.5" />
      <line x1="37" y1="41" x2="40" y2="38" stroke={c} strokeWidth="1.5" />
      <line x1="43" y1="41" x2="40" y2="38" stroke={c} strokeWidth="1.5" />
      {/* Pipes */}
      <circle cx="15" cy="30" r="4" fill="none" stroke={c} strokeWidth="1.5" />
      <circle cx="65" cy="30" r="4" fill="none" stroke={c} strokeWidth="1.5" />
      <text x="40" y="56" textAnchor="middle" fontSize="8" fontWeight="bold" fill={c}>CHILLER</text>
    </svg>
  );
}
