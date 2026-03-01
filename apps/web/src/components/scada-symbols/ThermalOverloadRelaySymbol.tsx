import React from 'react';

interface ThermalOverloadRelaySymbolProps {
  width?: number;
  height?: number;
  state?: 'NORMAL' | 'OPERATED' | 'BLOCKED';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function ThermalOverloadRelaySymbol({ width = 50, height = 60, state = 'NORMAL', color, onClick, label }: ThermalOverloadRelaySymbolProps) {
  const stateColor = color || (state === 'NORMAL' ? '#1E40AF' : state === 'OPERATED' ? '#DC2626' : '#D97706');
  return (
    <svg width={width} height={height} viewBox="0 0 50 60" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }} xmlns="http://www.w3.org/2000/svg">
      {/* Top connection */}
      <line x1={25} y1={0} x2={25} y2={10} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />
      <circle cx={25} cy={10} r={3} fill={stateColor} />

      {/* Main circle */}
      <circle cx={25} cy={28} r={16} fill="none" stroke={stateColor} strokeWidth={2} />

      {/* ANSI number */}
      <text x={25} y={25} textAnchor="middle" dominantBaseline="central" fill={stateColor} fontSize={12} fontWeight="bold" fontFamily="Arial, sans-serif">49</text>

      {/* Function indicator below number */}
      <text x={25} y={36} textAnchor="middle" fill={stateColor} fontSize={5} fontFamily="Arial, sans-serif">THERM</text>

      {/* Thermometer indicator on the right side */}
      {/* Thermometer bulb */}
      <circle cx={42} cy={38} r={3} fill="none" stroke={stateColor} strokeWidth={1} />
      {/* Thermometer tube */}
      <rect x={40.5} y={22} width={3} height={14} rx={1.5} fill="none" stroke={stateColor} strokeWidth={1} />
      {/* Mercury level (higher when OPERATED) */}
      <rect x={41} y={state === 'OPERATED' ? 24 : 30} width={2} height={state === 'OPERATED' ? 14 : 8} rx={1} fill={stateColor} opacity={0.7} />
      {/* Temperature marks */}
      <line x1={44} y1={25} x2={46} y2={25} stroke={stateColor} strokeWidth={0.5} />
      <line x1={44} y1={29} x2={46} y2={29} stroke={stateColor} strokeWidth={0.5} />
      <line x1={44} y1={33} x2={46} y2={33} stroke={stateColor} strokeWidth={0.5} />

      {/* Bottom connection */}
      <circle cx={25} cy={46} r={3} fill={stateColor} />
      <line x1={25} y1={46} x2={25} y2={55} stroke={stateColor} strokeWidth={2} strokeLinecap="round" />

      {/* OPERATED state: pulse animation */}
      {state === 'OPERATED' && (
        <>
          <style>{`@keyframes thermal-overload-relay-pulse { 0%,100%{stroke-opacity:1}50%{stroke-opacity:0.3} } .thermal-overload-relay-operated{animation:thermal-overload-relay-pulse 0.8s ease-in-out infinite}`}</style>
          <circle className="thermal-overload-relay-operated" cx={25} cy={28} r={19} fill="none" stroke={stateColor} strokeWidth={2} strokeDasharray="3 2" />
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
