import React from 'react';

interface SolarStringSymbolProps {
  width?: number;
  height?: number;
  state?: 'ACTIVE' | 'INACTIVE' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  rotation?: number;
}

export default function SolarStringSymbol({
  width = 80,
  height = 60,
  state = 'ACTIVE',
  color,
  onClick,
  label,
  className,
  rotation,
}: SolarStringSymbolProps) {
  const stateColor =
    color ||
    (state === 'ACTIVE'
      ? '#16A34A'
      : state === 'INACTIVE'
        ? '#9CA3AF'
        : '#DC2626');

  const strokeWidth = 2;
  const labelColor = state === 'INACTIVE' ? '#9CA3AF' : '#1E293B';

  // Panel positions (3 panels in series)
  const panels = [
    { x: 4, y: 10, w: 18, h: 26 },
    { x: 26, y: 10, w: 18, h: 26 },
    { x: 48, y: 10, w: 18, h: 26 },
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={className}
      role="img"
      aria-label={label || `Solar String/Array (${state})`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-sstr {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .sstr-fault-flash {
              animation: fault-flash-sstr 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Left input connection line */}
      <line
        x1={0}
        y1={23}
        x2={4}
        y2={23}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Left terminal dot */}
      <circle cx={2} cy={23} r={3} fill={stateColor} />

      {/* Panel 1 */}
      <rect
        className={state === 'FAULT' ? 'sstr-fault-flash' : undefined}
        x={panels[0].x}
        y={panels[0].y}
        width={panels[0].w}
        height={panels[0].h}
        rx={1}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        fill={stateColor}
        fillOpacity={0.08}
      />
      {/* Panel 1 grid — vertical */}
      <line x1={10.67} y1={10} x2={10.67} y2={36} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />
      <line x1={15.33} y1={10} x2={15.33} y2={36} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />
      {/* Panel 1 grid — horizontal */}
      <line x1={4} y1={18.67} x2={22} y2={18.67} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />
      <line x1={4} y1={27.33} x2={22} y2={27.33} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />

      {/* Connection line panel 1 to 2 */}
      <line
        x1={22}
        y1={23}
        x2={26}
        y2={23}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Panel 2 */}
      <rect
        className={state === 'FAULT' ? 'sstr-fault-flash' : undefined}
        x={panels[1].x}
        y={panels[1].y}
        width={panels[1].w}
        height={panels[1].h}
        rx={1}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        fill={stateColor}
        fillOpacity={0.08}
      />
      {/* Panel 2 grid — vertical */}
      <line x1={32.67} y1={10} x2={32.67} y2={36} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />
      <line x1={37.33} y1={10} x2={37.33} y2={36} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />
      {/* Panel 2 grid — horizontal */}
      <line x1={26} y1={18.67} x2={44} y2={18.67} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />
      <line x1={26} y1={27.33} x2={44} y2={27.33} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />

      {/* Connection line panel 2 to 3 */}
      <line
        x1={44}
        y1={23}
        x2={48}
        y2={23}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Panel 3 */}
      <rect
        className={state === 'FAULT' ? 'sstr-fault-flash' : undefined}
        x={panels[2].x}
        y={panels[2].y}
        width={panels[2].w}
        height={panels[2].h}
        rx={1}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        fill={stateColor}
        fillOpacity={0.08}
      />
      {/* Panel 3 grid — vertical */}
      <line x1={54.67} y1={10} x2={54.67} y2={36} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />
      <line x1={59.33} y1={10} x2={59.33} y2={36} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />
      {/* Panel 3 grid — horizontal */}
      <line x1={48} y1={18.67} x2={66} y2={18.67} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />
      <line x1={48} y1={27.33} x2={66} y2={27.33} stroke={stateColor} strokeWidth={0.5} opacity={0.4} />

      {/* String combiner output line from panel 3 */}
      <line
        x1={66}
        y1={23}
        x2={72}
        y2={23}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* String combiner box */}
      <rect
        x={72}
        y={17}
        width={6}
        height={12}
        rx={1}
        stroke={stateColor}
        strokeWidth={1.5}
        fill={stateColor}
        fillOpacity={0.15}
      />

      {/* Output connection line from combiner */}
      <line
        x1={78}
        y1={23}
        x2={80}
        y2={23}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Right output terminal dot */}
      <circle cx={78} cy={23} r={3} fill={stateColor} />

      {/* "PV" labels in each panel */}
      <text
        x={13}
        y={24}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        PV
      </text>
      <text
        x={35}
        y={24}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        PV
      </text>
      <text
        x={57}
        y={24}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        PV
      </text>

      {/* Label text */}
      <text
        x={40}
        y={47}
        fontSize={8}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
        fill={labelColor}
        textAnchor="middle"
      >
        {label || state}
      </text>

      {/* State indicator text */}
      <text
        x={40}
        y={56}
        fontSize={6}
        fontFamily="Arial, sans-serif"
        fontWeight="500"
        fill={stateColor}
        textAnchor="middle"
      >
        {state}
      </text>
    </svg>
  );
}
