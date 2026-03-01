import React from 'react';

interface WindTurbineSymbolProps {
  width?: number;
  height?: number;
  state?: 'GENERATING' | 'IDLE' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function WindTurbineSymbol({
  width = 60,
  height = 80,
  state = 'GENERATING',
  color,
  onClick,
  label,
  className,
  rotation,
}: WindTurbineSymbolProps) {
  const stateColor =
    color ||
    (state === 'GENERATING'
      ? '#16A34A'
      : state === 'IDLE'
        ? '#9CA3AF'
        : '#DC2626');

  const strokeWidth = 2;
  const labelColor = state === 'IDLE' ? '#9CA3AF' : '#1E293B';

  // Hub center for the rotor
  const hubX = 30;
  const hubY = 18;
  const bladeLength = 15;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 80"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Wind Turbine (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-wt {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .wt-fault-flash {
              animation: fault-flash-wt 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Blade animation when GENERATING */}
      {state === 'GENERATING' && (
        <style>
          {`
            @keyframes wt-blade-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .wt-rotor {
              transform-origin: ${hubX}px ${hubY}px;
              animation: wt-blade-spin 3s linear infinite;
            }
          `}
        </style>
      )}

      {/* Three-blade rotor */}
      <g
        className={state === 'GENERATING' ? 'wt-rotor' : undefined}
      >
        {/* Blade 1 — pointing up (0 degrees) */}
        <path
          className={state === 'FAULT' ? 'wt-fault-flash' : undefined}
          d={`M ${hubX},${hubY} Q ${hubX - 4},${hubY - bladeLength * 0.5} ${hubX},${hubY - bladeLength}`}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        {/* Blade 2 — pointing lower-right (120 degrees) */}
        <path
          className={state === 'FAULT' ? 'wt-fault-flash' : undefined}
          d={`M ${hubX},${hubY} Q ${hubX + bladeLength * 0.5},${hubY + 2} ${hubX + bladeLength * 0.866},${hubY + bladeLength * 0.5}`}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        {/* Blade 3 — pointing lower-left (240 degrees) */}
        <path
          className={state === 'FAULT' ? 'wt-fault-flash' : undefined}
          d={`M ${hubX},${hubY} Q ${hubX - bladeLength * 0.5},${hubY + 2} ${hubX - bladeLength * 0.866},${hubY + bladeLength * 0.5}`}
          stroke={stateColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Hub center circle */}
      <circle
        cx={hubX}
        cy={hubY}
        r={3}
        fill={stateColor}
        stroke={stateColor}
        strokeWidth={1}
      />

      {/* Tower line going down from hub to generator base */}
      <line
        x1={hubX}
        y1={hubY + 3}
        x2={hubX}
        y2={48}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Generator circle at base */}
      <circle
        className={state === 'FAULT' ? 'wt-fault-flash' : undefined}
        cx={hubX}
        cy={56}
        r={8}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        fill={stateColor}
        fillOpacity={0.08}
      />

      {/* "G" letter inside generator circle */}
      <text
        x={hubX}
        y={56}
        fontSize={9}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        G
      </text>

      {/* Bottom connection line from generator */}
      <line
        x1={hubX}
        y1={64}
        x2={hubX}
        y2={70}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Bottom terminal dot */}
      <circle cx={hubX} cy={70} r={3} fill={stateColor} />

      {/* Right connection line from generator */}
      <line
        x1={38}
        y1={56}
        x2={46}
        y2={56}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Right terminal dot */}
      <circle cx={46} cy={56} r={3} fill={stateColor} />

      {/* Label text */}
      <text
        x={hubX}
        y={78}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
        fill={labelColor}
        textAnchor="middle"
      >
        {label || state}
      </text>
    </svg>
  );
}
