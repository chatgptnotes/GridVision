import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useAlarmStore } from '@/stores/alarmStore';
import { useAuthStore } from '@/stores/authStore';
import AlarmPanel from '@/components/alarms/AlarmPanel';
import AlarmHistory from '@/components/alarms/AlarmHistory';
import { ALARM_PRIORITIES } from '@gridvision/shared';
import type { ActiveAlarm, AlarmPriority } from '@gridvision/shared';

export default function Alarms() {
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [filterPriority, setFilterPriority] = useState<AlarmPriority | null>(null);
  const activeAlarms = useAlarmStore((s) => s.activeAlarms);
  const setActiveAlarms = useAlarmStore((s) => s.setActiveAlarms);
  const setSummary = useAlarmStore((s) => s.setSummary);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  useEffect(() => {
    fetchActiveAlarms();
    fetchSummary();
  }, []);

  const fetchActiveAlarms = async () => {
    const { data } = await api.get<ActiveAlarm[]>('/alarms/active');
    setActiveAlarms(data);
  };

  const fetchSummary = async () => {
    const { data } = await api.get('/alarms/summary');
    setSummary(data);
  };

  const handleAcknowledge = async (alarmId: string) => {
    await api.post(`/alarms/${alarmId}/acknowledge`);
    fetchActiveAlarms();
    fetchSummary();
  };

  const handleShelve = async (alarmId: string, minutes: number) => {
    await api.post(`/alarms/${alarmId}/shelve`, { durationMinutes: minutes });
    fetchActiveAlarms();
  };

  const filteredAlarms = filterPriority
    ? activeAlarms.filter((a) => a.priority === filterPriority)
    : activeAlarms;

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Alarm Management</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setTab('active')}
              className={`px-3 py-1 text-sm rounded ${tab === 'active' ? 'bg-scada-accent text-white' : 'bg-scada-panel text-gray-400'}`}
            >
              Active ({activeAlarms.length})
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-3 py-1 text-sm rounded ${tab === 'history' ? 'bg-scada-accent text-white' : 'bg-scada-panel text-gray-400'}`}
            >
              History
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Filter:</span>
          <button
            onClick={() => setFilterPriority(null)}
            className={`px-2 py-0.5 text-xs rounded ${!filterPriority ? 'bg-scada-accent text-white' : 'bg-scada-panel text-gray-400'}`}
          >
            All
          </button>
          {([1, 2, 3, 4] as AlarmPriority[]).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className="px-2 py-0.5 text-xs rounded"
              style={{
                backgroundColor: filterPriority === p ? ALARM_PRIORITIES[p].color : 'transparent',
                color: filterPriority === p ? 'white' : ALARM_PRIORITIES[p].color,
                border: `1px solid ${ALARM_PRIORITIES[p].color}`,
              }}
            >
              {ALARM_PRIORITIES[p].level}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {tab === 'active' ? (
          <AlarmPanel
            alarms={filteredAlarms}
            canAcknowledge={hasPermission('ack:alarms')}
            onAcknowledge={handleAcknowledge}
            onShelve={handleShelve}
          />
        ) : (
          <AlarmHistory />
        )}
      </div>
    </div>
  );
}
