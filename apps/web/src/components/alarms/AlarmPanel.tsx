import { format } from 'date-fns';
import { ALARM_PRIORITIES } from '@gridvision/shared';
import type { ActiveAlarm } from '@gridvision/shared';
import clsx from 'clsx';

interface Props {
  alarms: ActiveAlarm[];
  canAcknowledge: boolean;
  onAcknowledge: (id: string) => void;
  onShelve: (id: string, minutes: number) => void;
}

export default function AlarmPanel({ alarms, canAcknowledge, onAcknowledge, onShelve }: Props) {
  if (alarms.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 bg-scada-panel border border-scada-border rounded-lg">
        No active alarms
      </div>
    );
  }

  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead className="sticky top-0 bg-scada-panel border-b border-scada-border">
          <tr className="text-left text-gray-400 text-xs">
            <th className="px-3 py-2 w-8">P</th>
            <th className="px-3 py-2 w-40">Time</th>
            <th className="px-3 py-2 w-20">State</th>
            <th className="px-3 py-2">Message</th>
            <th className="px-3 py-2 w-40">Equipment</th>
            <th className="px-3 py-2 w-36">Substation</th>
            <th className="px-3 py-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {alarms.map((alarm) => {
            const config = ALARM_PRIORITIES[alarm.priority];
            return (
              <tr
                key={alarm.id}
                className={clsx(
                  'border-b border-scada-border/30 hover:bg-scada-border/20',
                  alarm.state === 'RAISED' && alarm.priority <= 2 && 'alarm-flash',
                )}
              >
                <td className="px-3 py-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: config.color }}
                    title={config.level}
                  />
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  {format(new Date(alarm.raisedAt), 'dd-MMM HH:mm:ss')}
                </td>
                <td className="px-3 py-2">
                  <span className={clsx(
                    'text-xs px-1.5 py-0.5 rounded',
                    alarm.state === 'RAISED' && 'bg-red-900/30 text-red-400',
                    alarm.state === 'ACKNOWLEDGED' && 'bg-yellow-900/30 text-yellow-400',
                    alarm.state === 'SHELVED' && 'bg-blue-900/30 text-blue-400',
                  )}>
                    {alarm.state}
                  </span>
                </td>
                <td className="px-3 py-2" style={{ color: config.color }}>
                  {alarm.message}
                </td>
                <td className="px-3 py-2 text-xs text-gray-400">{alarm.equipmentName}</td>
                <td className="px-3 py-2 text-xs text-gray-400">{alarm.substationName}</td>
                <td className="px-3 py-2">
                  {canAcknowledge && alarm.state === 'RAISED' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => onAcknowledge(alarm.id)}
                        className="px-2 py-0.5 bg-scada-accent hover:bg-blue-600 text-white text-xs rounded"
                      >
                        ACK
                      </button>
                      <button
                        onClick={() => onShelve(alarm.id, 30)}
                        className="px-2 py-0.5 bg-scada-border hover:bg-gray-600 text-white text-xs rounded"
                      >
                        Shelve
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
