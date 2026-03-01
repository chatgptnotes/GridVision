import { useNumericValue } from '@/hooks/useRealTimeData';

interface Props {
  x: number;
  y: number;
  tag: string;
  label: string;
  unit: string;
  decimals?: number;
}

export default function MeasurementLabel({ x, y, tag, label, unit, decimals = 2 }: Props) {
  const value = useNumericValue(tag, decimals);

  return (
    <g>
      <rect x={x} y={y - 8} width={65} height={16} rx={2} fill="#1E293B" stroke="#334155" strokeWidth={0.5} />
      <text x={x + 3} y={y + 3} className="text-[7px] fill-gray-500">{label}</text>
      <text x={x + 62} y={y + 3} textAnchor="end" className="text-[8px] fill-white font-mono font-medium">
        {value} {unit}
      </text>
    </g>
  );
}
