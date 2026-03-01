import { useAlarmStore } from '@/stores/alarmStore';
import { ALARM_PRIORITIES } from '@gridvision/shared';

export default function AlarmBanner() {
  const latestAlarm = useAlarmStore((s) => s.activeAlarms[0]);

  if (!latestAlarm) return null;

  const config = ALARM_PRIORITIES[latestAlarm.priority];

  return (
    <div
      className="px-4 py-2 text-sm font-medium flex items-center gap-3 alarm-flash"
      style={{ backgroundColor: `${config.color}20`, borderBottom: `2px solid ${config.color}` }}
    >
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
      <span className="font-mono">{latestAlarm.message}</span>
      <span className="text-xs text-gray-400 ml-auto">{latestAlarm.tag}</span>
    </div>
  );
}
