import { VOLTAGE_COLORS } from '@ampris/shared';

interface Props {
  x: number;
  y: number;
  width: number;
  voltageKv: number;
  label?: string;
  energized?: boolean;
  color?: string;
}

export default function BusBar({ x, y, width, voltageKv, label, energized = true, color: overrideColor }: Props) {
  const color = overrideColor || (energized ? (VOLTAGE_COLORS[voltageKv] || VOLTAGE_COLORS[0]) : VOLTAGE_COLORS[0]);

  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {label && (
        <text x={x + width / 2} y={y - 10} textAnchor="middle" className="text-[9px] fill-gray-400">
          {label}
        </text>
      )}
    </g>
  );
}
