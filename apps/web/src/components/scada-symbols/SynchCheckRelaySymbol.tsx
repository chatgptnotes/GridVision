import React from 'react';

interface SynchCheckRelaySymbolProps {
  width?: number;
  height?: number;
  state?: 'NORMAL' | 'OPERATED' | 'BLOCKED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SynchCheckRelaySymbol({ width = 50, height = 60, state = 'NORMAL', color, onClick, label }: SynchCheckRelaySymbolProps) {
  const stateColor = color || (state === 'NORMAL' ? '#1E40AF' : state === 'OPERATED' ? '#DC2626' : '#D97706');
  return (
    <svg width={width} height={height} viewBox="0 0 50 60" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }} xmlns="http://www.w3.org/2000/svg">
      {/* Top connection */}
      <line x1={25} y1={0} x2={25} y2={10} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />
      <circle cx={25} cy={10} r={3} fill={stateColor} />

      {/* Main circle */}
      <circle cx={25} cy={28} r={16} fill="none" stroke={stateColor} strokeWidth={2} />

      {/* ANSI number */}
      <text x={25} y={24} textAnchor="middle" dominantBaseline="central" fill={stateColor} fontSize={12} fontWeight="bold" fontFamily="Arial, sans-serif">25</text>

      {/* Function indicator below number */}
      <text x={25} y={38} textAnchor="middle" fill={stateColor} fontSize={5} fontFamily="Arial, sans-serif">SYNC</text>

      {/* Sync indicator: two overlapping sine waves */}
      {/* First sine wave */}
      <path
        d="M 15,32 Q 18,28 21,32 Q 24,36 27,32 Q 30,28 33,32"
        fill="none"
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.8}
      />
      {/* Second sine wave (slightly offset to show overlap) */}
      <path
        d="M 17,32 Q 20,28 23,32 Q 26,36 29,32 Q 32,28 35,32"
        fill="none"
        stroke={stateColor}
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray="2 1"
        opacity={0.6}
      />

      {/* Bottom connection */}
      <circle cx={25} cy={46} r={3} fill={stateColor} />
      <line x1={25} y1={46} x2={25} y2={55} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />

      {/* OPERATED state: pulse animation */}
      {state === 'OPERATED' && (
        <>
          <style>{`@keyframes synch-check-relay-pulse { 0%,100%{stroke-opacity:1}50%{stroke-opacity:0.3} } .synch-check-relay-operated{animation:synch-check-relay-pulse 0.8s ease-in-out infinite}`}</style>
          <circle className="synch-check-relay-operated" cx={25} cy={28} r={19} fill="none" stroke={stateColor} strokeWidth={2} strokeDasharray="3 2" />
        </>
      )}

      {/* BLOCKED state: strikethrough */}
      {state === 'BLOCKED' && (
        <line x1={10} y1={40} x2={40} y2={16} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />
      )}

      {/* Label */}
      <text x={25} y={55} textAnchor="middle" fill={stateColor} fontSize={7} fontFamily="Arial, sans-serif" fontWeight="600">{label || state}</text>
    </svg>
  );
}
