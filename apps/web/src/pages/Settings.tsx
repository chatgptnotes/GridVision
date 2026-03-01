import { useAuthStore } from '@/stores/authStore';

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">System Settings</h2>

      {/* User Profile */}
      <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
        <h3 className="text-md font-medium mb-3">User Profile</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-400">Name:</span> <span className="ml-2">{user?.name}</span></div>
          <div><span className="text-gray-400">Username:</span> <span className="ml-2">{user?.username}</span></div>
          <div><span className="text-gray-400">Role:</span> <span className="ml-2 px-2 py-0.5 rounded bg-scada-accent/20 text-scada-accent text-xs">{user?.role}</span></div>
          <div><span className="text-gray-400">Email:</span> <span className="ml-2">{user?.email || '-'}</span></div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
        <h3 className="text-md font-medium mb-3">System Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-400">Application:</span> <span className="ml-2">GridVision SCADA v1.0.0</span></div>
          <div><span className="text-gray-400">Organization:</span> <span className="ml-2">MSEDCL</span></div>
          <div><span className="text-gray-400">Server Status:</span> <span className="ml-2 text-scada-success">Running</span></div>
          <div><span className="text-gray-400">Database:</span> <span className="ml-2 text-scada-success">Connected</span></div>
        </div>
      </div>

      {/* Admin-only: User Management */}
      {hasPermission('manage:users') && (
        <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
          <h3 className="text-md font-medium mb-3">User Management</h3>
          <p className="text-sm text-gray-400">
            User management interface for creating, editing, and deactivating user accounts.
          </p>
          <button className="mt-3 px-4 py-1.5 bg-scada-accent hover:bg-blue-600 text-white text-sm rounded">
            Manage Users
          </button>
        </div>
      )}

      {/* Admin-only: System Config */}
      {hasPermission('manage:settings') && (
        <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
          <h3 className="text-md font-medium mb-3">System Configuration</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Data Polling Interval</span>
              <select className="bg-scada-bg border border-scada-border rounded px-2 py-1 text-sm">
                <option>500ms</option>
                <option>1000ms</option>
                <option>2000ms</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Alarm Sound</span>
              <select className="bg-scada-bg border border-scada-border rounded px-2 py-1 text-sm">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
