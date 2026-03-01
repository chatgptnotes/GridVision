import React from 'react';

interface BatterySymbolProps {
  width?: number;
  height?: number;
  chargeLevel?: number;
  state?: 'CHARGING' | 'DISCHARGING' | 'STANDBY' | 'FAULT';
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function BatterySymbol({
  width = 50,
  height = 70,
  chargeLevel = 100,
  state = 'STANDBY',
  color,
  onClick,
  label,
}: BatterySymbolProps) {
  const stateColor =
    color ||
    (state === 'CHARGING'
      ? '#16A34A'
      : state === 'DISCHARGING'
        ? '#CA8A04'
        : state === 'FAULT'
          ? '#DC2626'
          : '#6B7280');

  const strokeWidth = 2;
  const labelColor = state === 'STANDBY' ? '#9CA3AF' : '#1E293B';

  // Clamp charge level
  const charge = Math.max(0, Math.min(100, chargeLevel));

  // Battery body dimensions
  const bodyLeft = 12;
  const bodyRight = 38;
  const bodyWidth = bodyRight - bodyLeft;
  const bodyTop = 18;
  const bodyBottom = 54;
  const bodyHeight = bodyBottom - bodyTop;

  // Charge fill dimensions (inside the body with small padding)
  const fillPadding = 2;
  const fillableHeight = bodyHeight - fillPadding * 2;
  const filledHeight = (charge / 100) * fillableHeight;

  // Fill color based on charge level
  const chargeFillColor =
    charge > 50
      ? '#16A34A'
      : charge > 20
        ? '#CA8A04'
        : '#DC2626';

  const cx = 25;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 50 70"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={
        label || `Battery (${state}, ${charge}% charged)`
      }
    >
      {/* Fault flash animation */}
      {state === 'FAULT' && (
        <style>
          {`
            @keyframes fault-flash-batt {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            .batt-fault-flash {
              animation: fault-flash-batt 0.8s ease-in-out infinite;
            }
          `}
        </style>
      )}

      {/* Positive terminal (+) connection line */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={10}
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Positive terminal nub (narrower top cap) */}
      <rect
        x={cx - 5}
        y={10}
        width={10}
        height={4}
        stroke={stateColor}
        strokeWidth={1.5}
        fill={stateColor}
        rx={1}
      />

      {/* "+" label */}
      <text
        x={bodyRight + 4}
        y={16}
        fontSize={10}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
      >
        +
      </text>

      {/* Battery body rectangle */}
      <rect
        className={state === 'FAULT' ? 'batt-fault-flash' : undefined}
        x={bodyLeft}
        y={bodyTop}
        width={bodyWidth}
        height={bodyHeight}
        stroke={stateColor}
        strokeWidth={strokeWidth}
        fill="none"
        rx={2}
      />

      {/* Charge level fill (fills from bottom up) */}
      {charge > 0 && (
        <rect
          x={bodyLeft + fillPadding}
          y={bodyTop + fillPadding + (fillableHeight - filledHeight)}
          width={bodyWidth - fillPadding * 2}
          height={filledHeight}
          fill={chargeFillColor}
          opacity={0.35}
          rx={1}
        />
      )}

      {/* Charge level text inside battery */}
      <text
        x={cx}
        y={bodyTop + bodyHeight / 2 + 4}
        fontSize={10}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fill={stateColor}
        textAnchor="middle"
      >
        {charge}%
      </text>

      {/* "-" label */}
      <text
        x={bodyRight + 4}
        y={bodyBottom}
        fontSize={12}
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fill={stateColor}
      >
        -
      </text>

      {/* Negative terminal connection line */}
      <line
        x1={cx}
        y1={bodyBottom}
        x2={cx}
        y2={60}
        stroke={stateColor}
        strokeWidth={strokeWidth}
      />

      {/* Charging indicator arrow (pointing into battery) */}
      {state === 'CHARGING' && (
        <g>
          <line
            x1={2}
            y1={36}
            x2={bodyLeft - 2}
            y2={36}
            stroke={stateColor}
            strokeWidth={1.5}
          />
          <polygon
            points={`${bodyLeft - 2},33 ${bodyLeft + 2},36 ${bodyLeft - 2},39`}
            fill={stateColor}
          />
        </g>
      )}

      {/* Discharging indicator arrow (pointing out of battery) */}
      {state === 'DISCHARGING' && (
        <g>
          <line
            x1={bodyRight + 2}
            y1={36}
            x2={48}
            y2={36}
            stroke={stateColor}
            strokeWidth={1.5}
          />
          <polygon
            points={`${44},33 ${48},36 ${44},39`}
            fill={stateColor}
          />
        </g>
      )}

      {/* Label text */}
      {label && (
        <text
          x={cx}
          y={68}
          fontSize={9}
          fontFamily="Arial, sans-serif"
          fontWeight="500"
          fill={labelColor}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
