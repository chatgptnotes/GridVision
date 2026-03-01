import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import {
  ChevronLeft,
  UserPlus,
  Shield,
  Trash2,
  X,
  Crown,
  Eye,
  Wrench,
  Monitor,
} from 'lucide-react';

interface Member {
  id: string;
  role: string;
  assignedAt: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string | null;
    role: string;
  };
}

interface ProjectData {
  id: string;
  name: string;
  userRole: string;
}

const ROLE_INFO: Record<string, { label: string; description: string; icon: React.ElementType; color: string }> = {
  OWNER: { label: 'Owner', description: 'Full control, can delete project', icon: Crown, color: 'text-amber-600 bg-amber-50' },
  ADMIN: { label: 'Admin', description: 'Edit mimics, manage members', icon: Shield, color: 'text-blue-600 bg-blue-50' },
  OPERATOR: { label: 'Operator', description: 'View live data, execute controls', icon: Monitor, color: 'text-green-600 bg-green-50' },
  VIEWER: { label: 'Viewer', description: 'View-only access', icon: Eye, color: 'text-gray-600 bg-gray-50' },
};

export default function ProjectMembers() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState('VIEWER');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);

  const canManage = project && ['OWNER', 'ADMIN'].includes(project.userRole);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    try {
      const [projRes, membersRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/projects/${projectId}/members`),
      ]);
      setProject(projRes.data);
      setMembers(membersRes.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async () => {
    if (!addEmail.trim()) return;
    setAdding(true);
    setAddError('');
    try {
      const { data } = await api.post(`/projects/${projectId}/members`, { email: addEmail, role: addRole });
      setMembers((prev) => [...prev, data]);
      setShowAddModal(false);
      setAddEmail('');
      setAddRole('VIEWER');
    } catch (err: any) {
      setAddError(err.response?.data?.error || 'Failed to add member');
    } finally {
      setAdding(false);
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    try {
      await api.put(`/projects/${projectId}/members/${memberId}`, { role: newRole });
      setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, role: newRole } : m));
    } catch {
      // ignore
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      await api.delete(`/projects/${projectId}/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      setRemoveConfirm(null);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(`/app/projects/${projectId}`)} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Team Members</h1>
            <p className="text-sm text-gray-500">{project?.name}</p>
          </div>
          <div className="flex-1" />
          {canManage && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          )}
        </div>

        {/* Role Descriptions */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {Object.entries(ROLE_INFO).map(([key, info]) => {
            const Icon = info.icon;
            return (
              <div key={key} className={`p-3 rounded-lg border border-gray-100 ${info.color.split(' ')[1]}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-4 h-4 ${info.color.split(' ')[0]}`} />
                  <span className={`text-sm font-medium ${info.color.split(' ')[0]}`}>{info.label}</span>
                </div>
                <p className="text-xs text-gray-500">{info.description}</p>
              </div>
            );
          })}
        </div>

        {/* Members List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Member</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Joined</th>
                {canManage && <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const roleInfo = ROLE_INFO[member.role] || ROLE_INFO.VIEWER;
                const RoleIcon = roleInfo.icon;
                return (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{member.user.name}</div>
                      <div className="text-xs text-gray-400">{member.user.email || member.user.username}</div>
                    </td>
                    <td className="px-4 py-3">
                      {canManage && member.role !== 'OWNER' ? (
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(member.id, e.target.value)}
                          className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-700 bg-white"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="OPERATOR">Operator</option>
                          <option value="VIEWER">Viewer</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleInfo.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(member.assignedAt).toLocaleDateString()}
                    </td>
                    {canManage && (
                      <td className="px-4 py-3 text-right">
                        {member.role !== 'OWNER' && (
                          <button
                            onClick={() => setRemoveConfirm(member.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add Member</h2>
              <button onClick={() => { setShowAddModal(false); setAddError(''); }} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {addError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{addError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="OPERATOR">Operator</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
              <button onClick={() => { setShowAddModal(false); setAddError(''); }} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!addEmail.trim() || adding}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation */}
      {removeConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Member</h3>
            <p className="text-sm text-gray-500 mb-4">
              This member will lose access to the project. This action can be undone by re-adding them.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRemoveConfirm(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
              <button
                onClick={() => handleRemove(removeConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
