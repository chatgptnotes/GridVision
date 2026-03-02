import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { Bell, Plus, Edit2, Trash2, BellOff, BellRing, X, Search, Clock, BarChart2 } from 'lucide-react';

interface AlarmDef {
  id: string;
  name: string;
  description: string | null;
  tagName: string;
  condition: string;
  setpoint: number | null;
  deadband: number | null;
  severity: number;
  priority: number;
  delay: number;
  autoAck: boolean;
  requiresComment: boolean;
  soundFile: string | null;
  enabled: boolean;
  shelved: boolean;
  suppressed: boolean;
  projectId: string;
}

const CONDITIONS = ['HI', 'HIHI', 'LO', 'LOLO', 'BOOL_TRUE', 'BOOL_FALSE'];
const SEVERITY_LABELS: Record<number, string> = { 1: 'LOW', 2: 'MEDIUM', 3: 'HIGH', 4: 'CRITICAL', 5: 'EMERGENCY' };
const SEVERITY_COLORS: Record<number, string> = { 1: 'text-blue-400', 2: 'text-yellow-400', 3: 'text-orange-400', 4: 'text-red-400', 5: 'text-red-300' };

const emptyDef = { name: '', description: '', tagName: '', condition: 'HI', setpoint: 0, deadband: 0, severity: 2, priority: 1, delay: 0, autoAck: false, requiresComment: false, soundFile: '', enabled: true };

export default function AlarmManager() {
  const { projectId } = useParams<{ projectId: string }>();
  const [defs, setDefs] = useState<AlarmDef[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [tab, setTab] = useState<'definitions' | 'history' | 'stats'>('definitions');
  const [editDef, setEditDef] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (!projectId) return;
    api.get('/project-alarms/definitions', { params: { projectId } }).then(r => setDefs(r.data));
    api.get('/tags', { params: { projectId } }).then(r => setTags(r.data.map((t: any) => t.name)));
  }, [projectId]);

  useEffect(() => {
    if (tab === 'history' && projectId) {
      api.get('/project-alarms/history', { params: { projectId } }).then(r => setHistory(r.data));
    }
  }, [tab, projectId]);

  const saveDef = async () => {
    if (!editDef || !projectId) return;
    const payload = { ...editDef, projectId };
    delete payload.id; delete payload.createdAt; delete payload.updatedAt;
    if (editDef.id) {
      await api.put(`/project-alarms/definitions/${editDef.id}`, payload);
    } else {
      await api.post('/project-alarms/definitions', payload);
    }
    setEditDef(null);
    api.get('/project-alarms/definitions', { params: { projectId } }).then(r => setDefs(r.data));
  };

  const deleteDef = async (id: string) => {
    if (!confirm('Delete this alarm definition?')) return;
    await api.delete(`/project-alarms/definitions/${id}`);
    setDefs(defs.filter(d => d.id !== id));
  };

  const shelve = async (id: string) => {
    await api.post(`/project-alarms/${id}/shelve`, { minutes: 60 });
    api.get('/project-alarms/definitions', { params: { projectId } }).then(r => setDefs(r.data));
  };

  const unshelve = async (id: string) => {
    await api.post(`/project-alarms/${id}/unshelve`);
    api.get('/project-alarms/definitions', { params: { projectId } }).then(r => setDefs(r.data));
  };

  const suppress = async (id: string) => {
    await api.post(`/project-alarms/${id}/suppress`);
    api.get('/project-alarms/definitions', { params: { projectId } }).then(r => setDefs(r.data));
  };

  const filtered = defs.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.tagName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-5 h-5 text-red-400" />
        <h1 className="text-lg font-bold text-white">Alarm Configuration</h1>
        <div className="flex-1" />
        <div className="flex gap-1">
          {(['definitions', 'history', 'stats'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-sm rounded ${tab === t ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}>
              {t === 'definitions' ? 'Definitions' : t === 'history' ? 'History' : 'Statistics'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'definitions' && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-2.5 top-2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alarms..." className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded text-white" />
            </div>
            <button onClick={() => setEditDef({ ...emptyDef })} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Add Alarm
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 text-xs border-b border-gray-700">
                <tr>
                  <th className="text-left py-2 px-2">Name</th>
                  <th className="text-left py-2 px-2">Tag</th>
                  <th className="text-left py-2 px-2">Condition</th>
                  <th className="text-left py-2 px-2">Setpoint</th>
                  <th className="text-left py-2 px-2">Severity</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-right py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-2 px-2 text-white">{d.name}</td>
                    <td className="py-2 px-2 text-gray-300 font-mono text-xs">{d.tagName}</td>
                    <td className="py-2 px-2 text-gray-300">{d.condition}</td>
                    <td className="py-2 px-2 text-gray-300">{d.setpoint ?? '—'}</td>
                    <td className={`py-2 px-2 font-medium ${SEVERITY_COLORS[d.severity]}`}>{SEVERITY_LABELS[d.severity]}</td>
                    <td className="py-2 px-2">
                      {d.shelved ? <span className="text-yellow-500 text-xs">SHELVED</span> :
                       d.suppressed ? <span className="text-gray-500 text-xs">SUPPRESSED</span> :
                       d.enabled ? <span className="text-green-400 text-xs">ENABLED</span> :
                       <span className="text-gray-500 text-xs">DISABLED</span>}
                    </td>
                    <td className="py-2 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditDef(d)} className="p-1 text-gray-400 hover:text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                        {d.shelved
                          ? <button onClick={() => unshelve(d.id)} className="p-1 text-yellow-400 hover:text-green-400" title="Unshelve"><BellRing className="w-3.5 h-3.5" /></button>
                          : <button onClick={() => shelve(d.id)} className="p-1 text-gray-400 hover:text-yellow-400" title="Shelve"><BellOff className="w-3.5 h-3.5" /></button>
                        }
                        <button onClick={() => deleteDef(d.id)} className="p-1 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'history' && (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-xs border-b border-gray-700">
              <tr>
                <th className="text-left py-2 px-2">Time</th>
                <th className="text-left py-2 px-2">Alarm</th>
                <th className="text-left py-2 px-2">Tag</th>
                <th className="text-left py-2 px-2">Severity</th>
                <th className="text-left py-2 px-2">Value</th>
                <th className="text-left py-2 px-2">State</th>
              </tr>
            </thead>
            <tbody>
              {history.map(a => (
                <tr key={a.id} className="border-b border-gray-800">
                  <td className="py-1.5 px-2 text-gray-400 font-mono text-xs">{new Date(a.activatedAt).toLocaleString()}</td>
                  <td className="py-1.5 px-2 text-white">{a.alarmName}</td>
                  <td className="py-1.5 px-2 text-gray-300 font-mono text-xs">{a.tagName}</td>
                  <td className={`py-1.5 px-2 ${SEVERITY_COLORS[a.severity]}`}>{SEVERITY_LABELS[a.severity]}</td>
                  <td className="py-1.5 px-2 text-gray-300">{a.triggerValue ?? '—'}</td>
                  <td className="py-1.5 px-2 text-gray-300">{a.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'stats' && (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Alarm statistics will appear here as alarms are generated.</p>
            <p className="text-xs mt-1">Total definitions: {defs.length} | Active alarms shown in banner below.</p>
          </div>
        </div>
      )}

      {/* Edit/Create Dialog */}
      {editDef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-5 w-[480px] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">{editDef.id ? 'Edit' : 'Create'} Alarm Definition</h3>
              <button onClick={() => setEditDef(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input value={editDef.name} onChange={e => setEditDef({ ...editDef, name: e.target.value })} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tag</label>
                <select value={editDef.tagName} onChange={e => setEditDef({ ...editDef, tagName: e.target.value })} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-900 bg-white">
                  <option value="">Select tag...</option>
                  {tags.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Condition</label>
                  <select value={editDef.condition} onChange={e => setEditDef({ ...editDef, condition: e.target.value })} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-900 bg-white">
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Setpoint</label>
                  <input type="number" value={editDef.setpoint ?? ''} onChange={e => setEditDef({ ...editDef, setpoint: e.target.value ? Number(e.target.value) : null })} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-900 bg-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Deadband</label>
                  <input type="number" value={editDef.deadband ?? 0} onChange={e => setEditDef({ ...editDef, deadband: Number(e.target.value) })} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Severity</label>
                  <select value={editDef.severity} onChange={e => setEditDef({ ...editDef, severity: Number(e.target.value) })} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-900 bg-white">
                    {[1,2,3,4,5].map(s => <option key={s} value={s}>{SEVERITY_LABELS[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Delay (s)</label>
                  <input type="number" value={editDef.delay} onChange={e => setEditDef({ ...editDef, delay: Number(e.target.value) })} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-900 bg-white" />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={editDef.autoAck} onChange={e => setEditDef({ ...editDef, autoAck: e.target.checked })} />
                  <span className="text-gray-700">Auto Ack</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={editDef.requiresComment} onChange={e => setEditDef({ ...editDef, requiresComment: e.target.checked })} />
                  <span className="text-gray-700">Require Comment</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4 pt-3 border-t">
              <button onClick={() => setEditDef(null)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
              <button onClick={saveDef} className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
