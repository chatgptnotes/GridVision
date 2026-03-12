import { VOLTAGE_COLORS } from '@ampris/shared';

interface Props {
  x: number;
  y: number;
  hvVoltage: number;
  lvVoltage: number;
  label?: string;
  mva?: number;
  onClick?: () => void;
}

export default function PowerTransformer({ x, y, hvVoltage, lvVoltage, label, mva, onClick }: Props) {
  const hvColor = VOLTAGE_COLORS[hvVoltage] || '#94A3B8';
  const lvColor = VOLTAGE_COLORS[lvVoltage] || '#94A3B8';
  const r = 18;

  return (
    <g onClick={onClick} className="cursor-pointer">
      {/* Connection lines */}
      <line x1={x} y1={y - r * 2 - 5} x2={x} y2={y - r + 2} stroke="#94A3B8" strokeWidth={2} />
      <line x1={x} y1={y + r - 2} x2={x} y2={y + r * 2 + 5} stroke="#94A3B8" strokeWidth={2} />

      {/* HV winding (top circle) */}
      <circle cx={x} cy={y - r / 2} r={r} fill="none" stroke={hvColor} strokeWidth={2} />

      {/* LV winding (bottom circle - overlapping) */}
      <circle cx={x} cy={y + r / 2} r={r} fill="none" stroke={lvColor} strokeWidth={2} />

      {/* Transformer label */}
      {label && (
        <text x={x + r + 8} y={y - 2} className="text-[9px] fill-gray-300 font-medium">
          {label}
        </text>
      )}
      {mva && (
        <text x={x + r + 8} y={y + 10} className="text-[8px] fill-gray-500">
          {mva} MVA
        </text>
      )}

      {/* Voltage labels */}
      <text x={x - r - 8} y={y - r / 2} textAnchor="end" className="text-[7px] fill-gray-500">
        {hvVoltage}kV
      </text>
      <text x={x - r - 8} y={y + r / 2} textAnchor="end" className="text-[7px] fill-gray-500">
        {lvVoltage}kV
      </text>
    </g>
  );
}
