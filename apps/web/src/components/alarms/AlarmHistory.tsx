import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { ALARM_PRIORITIES } from '@ampris/shared';

interface HistoryAlarm {
  id: string;
  raisedAt: string;
  clearedAt: string | null;
  ackedAt: string | null;
  priority: 1 | 2 | 3 | 4;
  message: string;
  alarmDef: {
    alarmType: string;
    dataPoint: {
      tag: string;
      equipment: { name: string; tag: string };
    };
  };
}

export default function AlarmHistory() {
  const [alarms, setAlarms] = useState<HistoryAlarm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/alarms/history', { params: { limit: 200 } })
      .then(({ data }) => setAlarms(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead className="sticky top-0 bg-scada-panel border-b border-scada-border">
          <tr className="text-left text-gray-400 text-xs">
            <th className="px-3 py-2 w-8">P</th>
            <th className="px-3 py-2 w-40">Raised</th>
            <th className="px-3 py-2 w-40">Cleared</th>
            <th className="px-3 py-2 w-40">Ack'd</th>
            <th className="px-3 py-2">Message</th>
            <th className="px-3 py-2 w-44">Tag</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
          ) : (
            alarms.map((alarm) => {
              const config = ALARM_PRIORITIES[alarm.priority];
              return (
                <tr key={alarm.id} className="border-b border-scada-border/30 hover:bg-scada-border/20">
                  <td className="px-3 py-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: config.color }} />
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {format(new Date(alarm.raisedAt), 'dd-MMM HH:mm:ss')}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-400">
                    {alarm.clearedAt ? format(new Date(alarm.clearedAt), 'dd-MMM HH:mm:ss') : '-'}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-gray-400">
                    {alarm.ackedAt ? format(new Date(alarm.ackedAt), 'dd-MMM HH:mm:ss') : '-'}
                  </td>
                  <td className="px-3 py-2">{alarm.message}</td>
                  <td className="px-3 py-2 font-mono text-xs text-scada-accent">{alarm.alarmDef.dataPoint.tag}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
