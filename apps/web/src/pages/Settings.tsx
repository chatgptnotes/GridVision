import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@ampris/shared';
import { Users, Shield, Settings as SettingsIcon, UserPlus, Trash2 } from 'lucide-react';

interface ManagedUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
}

const DEMO_USERS: ManagedUser[] = [
  { id: '1', username: 'admin', name: 'Administrator', email: 'admin@ampris.in', role: 'ADMIN', isActive: true, lastLogin: '2026-02-28T10:30:00Z' },
  { id: '2', username: 'operator1', name: 'Operator One', email: 'op1@ampris.in', role: 'OPERATOR', isActive: true, lastLogin: '2026-02-28T08:15:00Z' },
  { id: '3', username: 'engineer1', name: 'Engineer One', email: 'eng1@ampris.in', role: 'ENGINEER', isActive: true, lastLogin: '2026-02-27T14:00:00Z' },
  { id: '4', username: 'viewer1', name: 'Viewer User', email: 'viewer@ampris.in', role: 'VIEWER', isActive: true, lastLogin: '2026-02-26T09:00:00Z' },
  { id: '5', username: 'operator2', name: 'Operator Two', email: 'op2@ampris.in', role: 'OPERATOR', isActive: false },
];

const ROLE_OPTIONS: UserRole[] = ['ADMIN', 'ENGINEER', 'OPERATOR', 'VIEWER'];

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-red-900/30 text-red-400',
  ENGINEER: 'bg-purple-900/30 text-purple-400',
  OPERATOR: 'bg-blue-900/30 text-blue-400',
  VIEWER: 'bg-gray-700/30 text-gray-300',
};

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [users, setUsers] = useState<ManagedUser[]>(DEMO_USERS);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', name: '', email: '', role: 'OPERATOR' as UserRole, password: '' });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleAddUser = () => {
    const u: ManagedUser = {
      id: String(Date.now()),
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: true,
    };
    setUsers([...users, u]);
    setNewUser({ username: '', name: '', email: '', role: 'OPERATOR', password: '' });
    setShowAddUser(false);
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
    setEditingUserId(null);
  };

  const handleToggleActive = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)));
  };

  return (
    <div className="space-y-4 overflow-auto">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <SettingsIcon className="w-5 h-5 text-scada-accent" />
        System Settings
      </h2>

      {/* User Profile */}
      <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
        <h3 className="text-md font-medium mb-3">User Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-400">Name:</span> <span className="ml-2">{user?.name}</span></div>
          <div><span className="text-gray-400">Username:</span> <span className="ml-2">{user?.username}</span></div>
          <div>
            <span className="text-gray-400">Role:</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${ROLE_COLORS[user?.role as UserRole] || 'bg-scada-accent/20 text-scada-accent'}`}>
              {user?.role}
            </span>
          </div>
          <div><span className="text-gray-400">Email:</span> <span className="ml-2">{user?.email || '-'}</span></div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
        <h3 className="text-md font-medium mb-3">System Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-400">Application:</span> <span className="ml-2">Ampris SCADA v1.0.0</span></div>
          <div><span className="text-gray-400">Organization:</span> <span className="ml-2">Ampris</span></div>
          <div><span className="text-gray-400">Server Status:</span> <span className="ml-2 text-scada-success">Running</span></div>
          <div><span className="text-gray-400">Database:</span> <span className="ml-2 text-scada-success">Connected</span></div>
        </div>
      </div>

      {/* Admin-only: User Management */}
      {hasPermission('manage:users') && (
        <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-md font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-scada-accent" />
              User Management
            </h3>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-scada-accent hover:bg-blue-600 text-white text-sm rounded"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <div className="bg-scada-bg border border-scada-border rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium mb-3">New User</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Username"
                  className="bg-scada-panel border border-scada-border rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Full Name"
                  className="bg-scada-panel border border-scada-border rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Email"
                  className="bg-scada-panel border border-scada-border rounded px-3 py-1.5 text-sm"
                />
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Password"
                  className="bg-scada-panel border border-scada-border rounded px-3 py-1.5 text-sm"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="bg-scada-panel border border-scada-border rounded px-3 py-1.5 text-sm"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddUser}
                    disabled={!newUser.username || !newUser.name}
                    className="px-4 py-1.5 bg-scada-accent hover:bg-blue-600 text-white text-sm rounded disabled:opacity-50"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="px-4 py-1.5 bg-scada-bg border border-scada-border text-sm rounded hover:bg-scada-border/50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User List */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b border-scada-border">
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Username</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Last Login</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-scada-border/30 hover:bg-scada-border/20">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-scada-accent/20 text-scada-accent rounded-full flex items-center justify-center text-xs font-bold">
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-400">{u.username}</td>
                    <td className="px-3 py-2">
                      {editingUserId === u.id ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="bg-scada-bg border border-scada-border rounded px-2 py-0.5 text-xs"
                          autoFocus
                          onBlur={() => setEditingUserId(null)}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingUserId(u.id)}
                          className={`text-xs px-2 py-0.5 rounded cursor-pointer hover:ring-1 hover:ring-scada-accent ${ROLE_COLORS[u.role]}`}
                          title="Click to change role"
                        >
                          <Shield className="w-3 h-3 inline mr-1" />
                          {u.role}
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${u.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-400 font-mono">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleActive(u.id)}
                          className={`px-2 py-0.5 text-xs rounded ${u.isActive ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'}`}
                        >
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          onClick={() => setUsers(users.filter((x) => x.id !== u.id))}
                          className="p-1 text-gray-400 hover:text-red-400"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin-only: System Config */}
      {hasPermission('manage:settings') && (
        <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
          <h3 className="text-md font-medium mb-3">System Configuration</h3>
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-gray-400">Data Polling Interval</span>
              <select className="w-full sm:w-auto bg-scada-bg border border-scada-border rounded px-2 py-1 text-sm">
                <option>500ms</option>
                <option>1000ms</option>
                <option>2000ms</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-gray-400">Alarm Sound</span>
              <select className="w-full sm:w-auto bg-scada-bg border border-scada-border rounded px-2 py-1 text-sm">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-gray-400">Session Timeout</span>
              <select className="w-full sm:w-auto bg-scada-bg border border-scada-border rounded px-2 py-1 text-sm">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
