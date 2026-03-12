import { VOLTAGE_COLORS } from '@ampris/shared';

interface Props {
  x: number;
  y: number;
  voltageKv: number;
  label?: string;
  energized?: boolean;
}

export default function FeederLine({ x, y, voltageKv, label, energized = true }: Props) {
  const color = energized ? (VOLTAGE_COLORS[voltageKv] || '#94A3B8') : VOLTAGE_COLORS[0];

  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 30} stroke={color} strokeWidth={2} />
      {/* Arrow */}
      <polygon
        points={`${x},${y + 30} ${x - 4},${y + 22} ${x + 4},${y + 22}`}
        fill={color}
      />
      {label && (
        <text x={x} y={y + 44} textAnchor="middle" className="text-[8px] fill-gray-300 font-medium">
          {label}
        </text>
      )}
    </g>
  );
}
