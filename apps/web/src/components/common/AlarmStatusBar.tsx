import { useAlarmStore } from '@/stores/alarmStore';
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import clsx from 'clsx';

export default function AlarmStatusBar() {
  const summary = useAlarmStore((s) => s.summary);
  const soundEnabled = useAlarmStore((s) => s.soundEnabled);
  const toggleSound = useAlarmStore((s) => s.toggleSound);
  const latestAlarm = useAlarmStore((s) => s.activeAlarms[0]);

  return (
    <footer className="h-8 bg-scada-panel border-t border-scada-border flex items-center px-4 justify-between shrink-0 text-xs">
      <div className="flex items-center gap-4">
        {/* Alarm counts by priority */}
        <div className="flex items-center gap-2">
          <AlarmBadge label="EMG" count={summary.emergency} color="bg-red-600" />
          <AlarmBadge label="URG" count={summary.urgent} color="bg-orange-500" />
          <AlarmBadge label="NRM" count={summary.normal} color="bg-yellow-500" />
          <AlarmBadge label="INF" count={summary.info} color="bg-blue-500" />
        </div>

        {/* Unacknowledged */}
        <div className="flex items-center gap-1 text-gray-400">
          {summary.unacknowledged > 0 ? (
            <Bell className="w-3.5 h-3.5 text-scada-warning alarm-flash" />
          ) : (
            <BellOff className="w-3.5 h-3.5" />
          )}
          <span>{summary.unacknowledged} unack</span>
        </div>
      </div>

      {/* Latest alarm message */}
      <div className="flex-1 mx-4 truncate text-center">
        {latestAlarm ? (
          <span className={clsx(
            'font-mono',
            latestAlarm.priority === 1 && 'text-red-400 alarm-flash',
            latestAlarm.priority === 2 && 'text-orange-400',
            latestAlarm.priority === 3 && 'text-yellow-400',
            latestAlarm.priority === 4 && 'text-blue-400',
          )}>
            {latestAlarm.message}
          </span>
        ) : (
          <span className="text-gray-500">No active alarms</span>
        )}
      </div>

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className="p-1 rounded hover:bg-scada-border/50 text-gray-400"
        title={soundEnabled ? 'Mute alarms' : 'Enable alarm sounds'}
      >
        {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
      </button>
    </footer>
  );
}

function AlarmBadge({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={clsx('w-2 h-2 rounded-full', color, count > 0 && 'animate-pulse')} />
      <span className="text-gray-400">
        {label}: <span className="text-white font-medium">{count}</span>
      </span>
    </div>
  );
}
