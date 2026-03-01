import { useNumericValue } from '@/hooks/useRealTimeData';

interface Props {
  tag: string;
  label: string;
}

export default function PowerFactorGauge({ tag, label }: Props) {
  const value = useNumericValue(tag, 3);
  const numValue = parseFloat(value) || 0;

  const angle = numValue * 180; // 0 to 180 degrees for 0 to 1 PF
  const color = numValue >= 0.95 ? '#16A34A' : numValue >= 0.85 ? '#EAB308' : '#DC2626';

  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg p-3">
      <div className="text-xs text-gray-400 mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <svg width="60" height="35" viewBox="0 0 60 35">
          {/* Background arc */}
          <path
            d="M 5 30 A 25 25 0 0 1 55 30"
            fill="none"
            stroke="#334155"
            strokeWidth={4}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d={describeArc(30, 30, 25, 180, 180 - angle)}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1={30}
            y1={30}
            x2={30 + 20 * Math.cos((Math.PI * (180 - angle)) / 180)}
            y2={30 - 20 * Math.sin((Math.PI * (180 - angle)) / 180)}
            stroke="white"
            strokeWidth={1.5}
          />
          <circle cx={30} cy={30} r={2} fill="white" />
        </svg>
        <div>
          <div className="text-lg font-bold font-mono" style={{ color }}>{value}</div>
          <div className="text-[10px] text-gray-500">PF</div>
        </div>
      </div>
    </div>
  );
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = startAngle - endAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}
