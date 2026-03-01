import { useNumericValue } from '@/hooks/useRealTimeData';
import clsx from 'clsx';

interface Props {
  substationCode: string;
  feederCount: number;
}

export default function LoadDistribution({ substationCode, feederCount }: Props) {
  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-3">Feeder Load Distribution</h3>
      <div className="space-y-2">
        {Array.from({ length: feederCount }, (_, i) => {
          const fdrNum = String(i + 1).padStart(2, '0');
          return (
            <FeederBar
              key={i}
              label={`Feeder ${i + 1}`}
              currentTag={`${substationCode}_11KV_FDR${fdrNum}_I_R`}
              ratedCurrent={400}
            />
          );
        })}
      </div>
    </div>
  );
}

function FeederBar({ label, currentTag, ratedCurrent }: { label: string; currentTag: string; ratedCurrent: number }) {
  const value = useNumericValue(currentTag, 1);
  const numValue = parseFloat(value) || 0;
  const percent = Math.min((numValue / ratedCurrent) * 100, 120);

  const barColor = percent > 100
    ? 'bg-red-500'
    : percent > 80
    ? 'bg-orange-500'
    : percent > 60
    ? 'bg-yellow-500'
    : 'bg-green-500';

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-scada-bg rounded-full h-3 overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all', barColor)}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <span className="text-xs font-mono text-white w-16 text-right">{value} A</span>
      <span className="text-[10px] text-gray-500 w-12 text-right">{percent.toFixed(0)}%</span>
    </div>
  );
}
