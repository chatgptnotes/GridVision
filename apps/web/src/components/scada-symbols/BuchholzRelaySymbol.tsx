import React from 'react';

interface BuchholzRelaySymbolProps {
  width?: number;
  height?: number;
  state?: 'NORMAL' | 'OPERATED' | 'BLOCKED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function BuchholzRelaySymbol({ width = 50, height = 60, state = 'NORMAL', color, onClick, label }: BuchholzRelaySymbolProps) {
  const stateColor = color || (state === 'NORMAL' ? '#1E40AF' : state === 'OPERATED' ? '#DC2626' : '#D97706');
  return (
    <svg width={width} height={height} viewBox="0 0 50 60" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }} xmlns="http://www.w3.org/2000/svg">
      {/* Top connection */}
      <line x1={25} y1={0} x2={25} y2={10} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />
      <circle cx={25} cy={10} r={3} fill={stateColor} />

      {/* Main circle */}
      <circle cx={25} cy={28} r={16} fill="none" stroke={stateColor} strokeWidth={2} />

      {/* Device identifier */}
      <text x={25} y={26} textAnchor="middle" dominantBaseline="central" fill={stateColor} fontSize={12} fontWeight="bold" fontFamily="Arial, sans-serif">BH</text>

      {/* Function indicator below identifier */}
      <text x={25} y={36} textAnchor="middle" fill={stateColor} fontSize={6} fontFamily="Arial, sans-serif">GAS</text>

      {/* Bottom connection */}
      <circle cx={25} cy={46} r={3} fill={stateColor} />
      <line x1={25} y1={46} x2={25} y2={55} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />

      {/* OPERATED state: gas bubble indicators inside the circle */}
      {state === 'OPERATED' && (
        <>
          <style>{`@keyframes buchholz-relay-pulse { 0%,100%{stroke-opacity:1}50%{stroke-opacity:0.3} } .buchholz-relay-operated{animation:buchholz-relay-pulse 0.8s ease-in-out infinite} @keyframes buchholz-bubble-rise { 0%{transform:translateY(0);opacity:0.8} 100%{transform:translateY(-4px);opacity:0.2} } .buchholz-bubble{animation:buchholz-bubble-rise 1.2s ease-in-out infinite}`}</style>
          <circle className="buchholz-relay-operated" cx={25} cy={28} r={19} fill="none" stroke={stateColor} strokeWidth={2} strokeDasharray="3 2" />
          {/* Gas bubbles inside the circle */}
          <circle className="buchholz-bubble" cx={18} cy={22} r={2} fill={stateColor} opacity={0.5} />
          <circle className="buchholz-bubble" cx={25} cy={18} r={1.5} fill={stateColor} opacity={0.4} style={{ animationDelay: '0.3s' }} />
          <circle className="buchholz-bubble" cx={31} cy={20} r={2.5} fill={stateColor} opacity={0.5} style={{ animationDelay: '0.6s' }} />
          <circle className="buchholz-bubble" cx={22} cy={16} r={1} fill={stateColor} opacity={0.3} style={{ animationDelay: '0.9s' }} />
          <circle className="buchholz-bubble" cx={29} cy={15} r={1.5} fill={stateColor} opacity={0.4} style={{ animationDelay: '0.4s' }} />
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
