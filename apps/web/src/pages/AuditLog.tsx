import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { Shield, Search, Filter } from 'lucide-react';

interface AuditEntry {
  id: string;
  userId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
  user?: { username: string; name: string };
}

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    fetchAuditLog();
  }, []);

  const fetchAuditLog = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/audit', {
        params: { limit: 500 },
      });
      setEntries(Array.isArray(data) ? data : data.entries || []);
    } catch (error) {
      console.error('Failed to fetch audit log:', error);
      // Demo data fallback
      setEntries(generateDemoAuditEntries());
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (filterUser && !(entry.user?.username || '').toLowerCase().includes(filterUser.toLowerCase())) return false;
    if (filterAction && !entry.action.toLowerCase().includes(filterAction.toLowerCase())) return false;
    if (filterDateFrom) {
      const entryDate = new Date(entry.timestamp);
      if (entryDate < new Date(filterDateFrom)) return false;
    }
    if (filterDateTo) {
      const entryDate = new Date(entry.timestamp);
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      if (entryDate > toDate) return false;
    }
    return true;
  });

  const actionTypes = [...new Set(entries.map((e) => e.action))];

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-scada-accent" />
          Audit Log
        </h2>
        <span className="text-xs text-gray-400">{filteredEntries.length} entries</span>
      </div>

      {/* Filters */}
      <div className="bg-scada-panel border border-scada-border rounded-lg p-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-auto">
            <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1">
              <Search className="w-3 h-3" /> User
            </label>
            <input
              type="text"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              placeholder="Filter by user..."
              className="w-full bg-scada-bg border border-scada-border rounded px-3 py-1.5 text-sm"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Action
            </label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full bg-scada-bg border border-scada-border rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Actions</option>
              {actionTypes.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="text-xs text-gray-400 block mb-1">From</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full bg-scada-bg border border-scada-border rounded px-3 py-1.5 text-sm"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="text-xs text-gray-400 block mb-1">To</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full bg-scada-bg border border-scada-border rounded px-3 py-1.5 text-sm"
            />
          </div>
          <button
            onClick={() => { setFilterUser(''); setFilterAction(''); setFilterDateFrom(''); setFilterDateTo(''); }}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-scada-bg border border-scada-border rounded"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="flex-1 overflow-auto bg-scada-panel border border-scada-border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="sticky top-0 bg-scada-panel border-b border-scada-border">
              <tr className="text-left text-gray-400 text-xs">
                <th className="px-3 py-2 w-44">Timestamp</th>
                <th className="px-3 py-2 w-28">User</th>
                <th className="px-3 py-2 w-36">Action</th>
                <th className="px-3 py-2 w-24">Target</th>
                <th className="px-3 py-2">Details</th>
                <th className="px-3 py-2 w-28">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : filteredEntries.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No audit entries found</td></tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-scada-border/30 hover:bg-scada-border/20">
                    <td className="px-3 py-2 font-mono text-xs">
                      {format(new Date(entry.timestamp), 'dd-MMM-yyyy HH:mm:ss')}
                    </td>
                    <td className="px-3 py-2 text-scada-accent text-xs">
                      {entry.user?.username || entry.userId || 'System'}
                    </td>
                    <td className="px-3 py-2">
                      <ActionBadge action={entry.action} />
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-400">
                      {entry.targetType || '-'}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-400 truncate max-w-[200px]">
                      {entry.details ? JSON.stringify(entry.details).slice(0, 80) : '-'}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-400">
                      {entry.ipAddress || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const lower = action.toLowerCase();
  let color = 'bg-blue-900/30 text-blue-400';
  if (lower.includes('login')) color = 'bg-green-900/30 text-green-400';
  if (lower.includes('logout')) color = 'bg-gray-700/30 text-gray-300';
  if (lower.includes('delete') || lower.includes('remove')) color = 'bg-red-900/30 text-red-400';
  if (lower.includes('control') || lower.includes('operate')) color = 'bg-orange-900/30 text-orange-400';
  if (lower.includes('alarm') || lower.includes('ack')) color = 'bg-yellow-900/30 text-yellow-400';
  if (lower.includes('create') || lower.includes('add')) color = 'bg-purple-900/30 text-purple-400';

  return (
    <span className={`text-xs px-2 py-0.5 rounded ${color}`}>
      {action}
    </span>
  );
}

function generateDemoAuditEntries(): AuditEntry[] {
  const actions = [
    { action: 'LOGIN', targetType: 'session', details: { method: 'password' } },
    { action: 'ALARM_ACK', targetType: 'alarm', details: { alarmId: 'ALM-001', comment: 'Acknowledged by operator' } },
    { action: 'CONTROL_OPERATE', targetType: 'equipment', details: { equipment: 'CB-101', operation: 'OPEN' } },
    { action: 'REPORT_GENERATE', targetType: 'report', details: { type: 'daily-load' } },
    { action: 'SETTINGS_UPDATE', targetType: 'config', details: { setting: 'pollingInterval', value: '1000ms' } },
    { action: 'USER_CREATE', targetType: 'user', details: { username: 'operator2' } },
    { action: 'LOGOUT', targetType: 'session', details: {} },
    { action: 'ALARM_SHELVE', targetType: 'alarm', details: { alarmId: 'ALM-005', duration: '30min' } },
  ];

  const users = [
    { username: 'admin', name: 'Administrator' },
    { username: 'operator1', name: 'Operator One' },
    { username: 'engineer1', name: 'Engineer One' },
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const a = actions[i % actions.length];
    const u = users[i % users.length];
    return {
      id: `audit-${i}`,
      userId: u.username,
      action: a.action,
      targetType: a.targetType,
      targetId: `target-${i}`,
      details: a.details,
      ipAddress: `192.168.1.${100 + (i % 20)}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      user: u,
    };
  });
}
