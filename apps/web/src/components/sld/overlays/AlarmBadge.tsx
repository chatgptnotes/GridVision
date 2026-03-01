import { ALARM_PRIORITIES } from '@gridvision/shared';
import type { AlarmPriority } from '@gridvision/shared';

interface Props {
  x: number;
  y: number;
  priority: AlarmPriority;
  count?: number;
}

export default function AlarmBadge({ x, y, priority, count = 1 }: Props) {
  const config = ALARM_PRIORITIES[priority];

  return (
    <g className={priority <= 2 ? 'alarm-flash' : ''}>
      <circle cx={x} cy={y} r={6} fill={config.color} />
      {count > 1 && (
        <text x={x} y={y + 3} textAnchor="middle" className="text-[7px] fill-white font-bold">
          {count}
        </text>
      )}
    </g>
  );
}
