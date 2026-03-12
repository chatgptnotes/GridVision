import { useEffect, useState, useMemo } from 'react';
import { api } from '@/services/api';
import { useAlarmStore } from '@/stores/alarmStore';
import { useAuthStore } from '@/stores/authStore';
import AlarmPanel from '@/components/alarms/AlarmPanel';
import AlarmHistory from '@/components/alarms/AlarmHistory';
import { ALARM_PRIORITIES } from '@ampris/shared';
import type { ActiveAlarm, AlarmPriority } from '@ampris/shared';
import {
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Clock,
  Filter,
  BarChart3,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Critical',
  2: 'Major',
  3: 'Minor',
  4: 'Warning',
};

export default function Alarms() {
  const [tab, setTab] = useState<'active' | 'history' | 'statistics'>('active');
  const [filterPriority, setFilterPriority] = useState<AlarmPriority | null>(null);
  const [filterSubstation, setFilterSubstation] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'ack' | 'unack'>('all');
  const [ackComment, setAckComment] = useState('');
  const [ackingAlarmId, setAckingAlarmId] = useState<string | null>(null);
  const activeAlarms = useAlarmStore((s) => s.activeAlarms);
  const setActiveAlarms = useAlarmStore((s) => s.setActiveAlarms);
  const setSummary = useAlarmStore((s) => s.setSummary);
  const summary = useAlarmStore((s) => s.summary);
  const soundEnabled = useAlarmStore((s) => s.soundEnabled);
  const toggleSound = useAlarmStore((s) => s.toggleSound);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  useEffect(() => {
    fetchActiveAlarms();
    fetchSummary();
  }, []);

  const fetchActiveAlarms = async () => {
    try {
      const { data } = await api.get<ActiveAlarm[]>('/alarms/active');
      setActiveAlarms(data);
    } catch {
      // keep existing alarms
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await api.get('/alarms/summary');
      setSummary(data);
    } catch {
      // keep existing summary
    }
  };

  const handleAcknowledge = async (alarmId: string) => {
    setAckingAlarmId(alarmId);
  };

  const confirmAcknowledge = async () => {
    if (!ackingAlarmId) return;
    try {
      await api.post(`/alarms/${ackingAlarmId}/acknowledge`, { comment: ackComment });
      fetchActiveAlarms();
      fetchSummary();
    } catch (error) {
      console.error('Failed to acknowledge alarm:', error);
    }
    setAckingAlarmId(null);
    setAckComment('');
  };

  const handleShelve = async (alarmId: string, minutes: number) => {
    await api.post(`/alarms/${alarmId}/shelve`, { durationMinutes: minutes });
    fetchActiveAlarms();
  };

  const filteredAlarms = useMemo(() => {
    let result = activeAlarms;
    if (filterPriority) result = result.filter((a) => a.priority === filterPriority);
    if (filterSubstation) result = result.filter((a) => a.substationName?.toLowerCase().includes(filterSubstation.toLowerCase()));
    if (filterState === 'ack') result = result.filter((a) => a.state === 'ACKNOWLEDGED');
    if (filterState === 'unack') result = result.filter((a) => a.state === 'RAISED');
    return result;
  }, [activeAlarms, filterPriority, filterSubstation, filterState]);

  // Alarm statistics
  const stats = useMemo(() => {
    const byPriority = { 1: 0, 2: 0, 3: 0, 4: 0 } as Record<number, number>;
    activeAlarms.forEach((a) => { byPriority[a.priority] = (byPriority[a.priority] || 0) + 1; });
    const avgResolutionMs = activeAlarms
      .filter((a) => a.state !== 'RAISED')
      .reduce((sum, a) => {
        const raised = new Date(a.raisedAt).getTime();
        const resolved = a.clearedAt ? new Date(a.clearedAt).getTime() : Date.now();
        return sum + (resolved - raised);
      }, 0);
    const resolvedCount = activeAlarms.filter((a) => a.state !== 'RAISED').length;
    const mttr = resolvedCount > 0 ? Math.round(avgResolutionMs / resolvedCount / 60000) : 0;

    return { byPriority, mttr, unacked: summary.unacknowledged, total: activeAlarms.length };
  }, [activeAlarms, summary]);

  // Substations list for filter
  const substations = useMemo(() => {
    return [...new Set(activeAlarms.map((a) => a.substationName).filter(Boolean))];
  }, [activeAlarms]);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
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
            <button
              onClick={() => setTab('statistics')}
              className={`px-3 py-1 text-sm rounded ${tab === 'statistics' ? 'bg-scada-accent text-white' : 'bg-scada-panel text-gray-400'}`}
            >
              <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
              Stats
            </button>
          </div>
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-1.5 px-3 py-1 text-xs rounded bg-scada-panel border border-scada-border hover:bg-scada-border/50"
          title={soundEnabled ? 'Mute alarms' : 'Enable alarm sounds'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-scada-success" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          <span className={soundEnabled ? 'text-scada-success' : 'text-gray-400'}>
            {soundEnabled ? 'Sound ON' : 'Sound OFF'}
          </span>
        </button>
      </div>

      {/* Filters (active tab only) */}
      {tab === 'active' && (
        <div className="bg-scada-panel border border-scada-border rounded-lg p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">Priority:</span>
            </div>
            <button
              onClick={() => setFilterPriority(null)}
              className={`px-2 py-0.5 text-xs rounded ${!filterPriority ? 'bg-scada-accent text-white' : 'bg-scada-bg text-gray-400'}`}
            >
              All
            </button>
            {([1, 2, 3, 4] as AlarmPriority[]).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(filterPriority === p ? null : p)}
                className="px-2 py-0.5 text-xs rounded"
                style={{
                  backgroundColor: filterPriority === p ? ALARM_PRIORITIES[p].color : 'transparent',
                  color: filterPriority === p ? 'white' : ALARM_PRIORITIES[p].color,
                  border: `1px solid ${ALARM_PRIORITIES[p].color}`,
                }}
              >
                {PRIORITY_LABELS[p]}
              </button>
            ))}

            <span className="text-gray-600">|</span>

            <select
              value={filterSubstation}
              onChange={(e) => setFilterSubstation(e.target.value)}
              className="bg-scada-bg border border-scada-border rounded px-2 py-0.5 text-xs"
            >
              <option value="">All Substations</option>
              {substations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="flex gap-1">
              {(['all', 'unack', 'ack'] as const).map((state) => (
                <button
                  key={state}
                  onClick={() => setFilterState(state)}
                  className={`px-2 py-0.5 text-xs rounded ${filterState === state ? 'bg-scada-accent text-white' : 'bg-scada-bg text-gray-400 border border-scada-border'}`}
                >
                  {state === 'all' ? 'All' : state === 'unack' ? 'Unacknowledged' : 'Acknowledged'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {tab === 'active' ? (
          <>
            {/* Escalation indicators */}
            {filteredAlarms.some((a) => a.state === 'RAISED' && Date.now() - new Date(a.raisedAt).getTime() > 1800000) && (
              <div className="mb-3 bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                  <Clock className="w-4 h-4" />
                  Escalation Required — Alarms pending &gt;30 minutes
                </div>
                <div className="space-y-1">
                  {filteredAlarms
                    .filter((a) => a.state === 'RAISED' && Date.now() - new Date(a.raisedAt).getTime() > 1800000)
                    .map((a) => (
                      <div key={a.id} className="flex items-center gap-2 text-xs text-red-300">
                        <Bell className="w-3 h-3" />
                        <span className="font-mono">{a.message}</span>
                        <span className="text-gray-500 ml-auto">
                          {formatDistanceToNow(new Date(a.raisedAt), { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <AlarmPanel
              alarms={filteredAlarms}
              canAcknowledge={hasPermission('ack:alarms')}
              onAcknowledge={handleAcknowledge}
              onShelve={handleShelve}
            />
          </>
        ) : tab === 'history' ? (
          <AlarmHistory />
        ) : (
          /* Statistics Tab */
          <div className="space-y-4">
            {/* Count by priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {([1, 2, 3, 4] as const).map((p) => (
                <div key={p} className="bg-scada-panel border border-scada-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: ALARM_PRIORITIES[p].color }} />
                    <span className="text-sm font-medium">{PRIORITY_LABELS[p]}</span>
                  </div>
                  <div className="text-3xl font-bold font-mono" style={{ color: ALARM_PRIORITIES[p].color }}>
                    {stats.byPriority[p]}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">active alarms</div>
                </div>
              ))}
            </div>

            {/* MTTR and summary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-1">Mean Time to Resolve (MTTR)</div>
                <div className="text-2xl font-bold font-mono text-scada-accent">
                  {stats.mttr > 0 ? `${stats.mttr} min` : 'N/A'}
                </div>
              </div>
              <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-1">Total Active Alarms</div>
                <div className="text-2xl font-bold font-mono text-scada-warning">{stats.total}</div>
              </div>
              <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  {stats.unacked > 0 ? <Bell className="w-3 h-3 text-red-400" /> : <BellOff className="w-3 h-3" />}
                  Unacknowledged
                </div>
                <div className={`text-2xl font-bold font-mono ${stats.unacked > 0 ? 'text-red-400' : 'text-scada-success'}`}>
                  {stats.unacked}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Acknowledge Dialog */}
      {ackingAlarmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-scada-panel border border-scada-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Acknowledge Alarm</h3>
            <label className="text-xs text-gray-400 block mb-1">Comment (optional)</label>
            <textarea
              value={ackComment}
              onChange={(e) => setAckComment(e.target.value)}
              className="w-full bg-scada-bg border border-scada-border rounded px-3 py-2 text-sm mb-4 h-24 resize-none"
              placeholder="Enter acknowledgment comment..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setAckingAlarmId(null); setAckComment(''); }}
                className="px-4 py-1.5 text-sm bg-scada-bg border border-scada-border rounded hover:bg-scada-border/50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAcknowledge}
                className="px-4 py-1.5 text-sm bg-scada-accent hover:bg-blue-600 text-white rounded"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
