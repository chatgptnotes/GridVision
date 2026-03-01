import { useNumericValue } from '@/hooks/useRealTimeData';

interface Props {
  tag: string;
  label: string;
  unit: string;
  decimals?: number;
}

export default function ParameterCard({ tag, label, unit, decimals = 2 }: Props) {
  const value = useNumericValue(tag, decimals);

  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg p-3">
      <div className="text-xs text-gray-400 mb-1 truncate">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold font-mono text-white">{value}</span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      <div className="text-[10px] text-gray-600 font-mono mt-1 truncate">{tag}</div>
    </div>
  );
}
