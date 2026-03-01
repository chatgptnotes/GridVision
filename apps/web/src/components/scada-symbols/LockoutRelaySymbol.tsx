import React from 'react';

interface LockoutRelaySymbolProps {
  width?: number;
  height?: number;
  state?: 'NORMAL' | 'OPERATED' | 'BLOCKED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function LockoutRelaySymbol({ width = 50, height = 60, state = 'NORMAL', color, onClick, label }: LockoutRelaySymbolProps) {
  const stateColor = color || (state === 'NORMAL' ? '#1E40AF' : state === 'OPERATED' ? '#DC2626' : '#D97706');
  return (
    <svg width={width} height={height} viewBox="0 0 50 60" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }} xmlns="http://www.w3.org/2000/svg">
      {/* Top connection */}
      <line x1={25} y1={0} x2={25} y2={10} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />
      <circle cx={25} cy={10} r={3} fill={stateColor} />

      {/* Main circle */}
      <circle cx={25} cy={28} r={16} fill="none" stroke={stateColor} strokeWidth={2} />

      {/* ANSI number */}
      <text x={25} y={26} textAnchor="middle" dominantBaseline="central" fill={stateColor} fontSize={12} fontWeight="bold" fontFamily="Arial, sans-serif">86</text>

      {/* Function indicator below number */}
      <text x={25} y={36} textAnchor="middle" fill={stateColor} fontSize={6} fontFamily="Arial, sans-serif">L/O</text>

      {/* Bottom connection */}
      <circle cx={25} cy={46} r={3} fill={stateColor} />
      <line x1={25} y1={46} x2={25} y2={55} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />

      {/* OPERATED state: padlock icon indicator */}
      {state === 'OPERATED' && (
        <>
          <style>{`@keyframes lockout-relay-pulse { 0%,100%{opacity:1}50%{opacity:0.4} } .lockout-relay-operated{animation:lockout-relay-pulse 0.8s ease-in-out infinite}`}</style>
          <circle className="lockout-relay-operated" cx={25} cy={28} r={19} fill="none" stroke={stateColor} strokeWidth={2} strokeDasharray="3 2" />
          {/* Padlock icon - shackle (arc) */}
          <path d="M 39,8 A 4,4 0 0 1 47,8 L 47,13" fill="none" stroke={stateColor} strokeWidth={1.5} strokeLinecap="round" />
          {/* Padlock icon - body (rectangle) */}
          <rect x={37} y={12} width={12} height={9} rx={1.5} fill={stateColor} opacity={0.85} />
          {/* Padlock icon - keyhole */}
          <circle cx={43} cy={16} r={1.5} fill="white" />
          <line x1={43} y1={17} x2={43} y2={19} stroke="white" strokeWidth={1} strokeLinecap="round" />
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
