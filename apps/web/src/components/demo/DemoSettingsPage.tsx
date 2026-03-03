import { useState } from 'react';
import { 
  Settings, Wifi, Bell, Users, Database, Shield, 
  Save, RotateCcw, Eye, EyeOff, Clock, Mail, Phone,
  Globe, Server, Key, AlertTriangle, CheckCircle
} from 'lucide-react';

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: any;
}

const CONFIG_SECTIONS: ConfigSection[] = [
  {
    id: 'general',
    title: 'General Settings',
    description: 'Station information and basic configuration',
    icon: Settings
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Protocol settings and device connections',
    icon: Wifi
  },
  {
    id: 'alarms',
    title: 'Alarm Configuration',
    description: 'Thresholds, priorities, and notifications',
    icon: Bell
  },
  {
    id: 'users',
    title: 'User Management',
    description: 'User accounts and role-based access control',
    icon: Users
  },
  {
    id: 'database',
    title: 'Data Management',
    description: 'Historian settings and data retention',
    icon: Database
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Authentication, encryption, and audit settings',
    icon: Shield
  }
];

interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'Admin' | 'Operator' | 'Viewer';
  email: string;
  lastLogin: Date;
  active: boolean;
}

const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'System Administrator',
    role: 'Admin',
    email: 'admin@power.com',
    lastLogin: new Date(Date.now() - 3600000),
    active: true
  },
  {
    id: '2',
    username: 'operator1',
    fullName: 'John Operator',
    role: 'Operator',
    email: 'john@power.com',
    lastLogin: new Date(Date.now() - 7200000),
    active: true
  },
  {
    id: '3',
    username: 'viewer1',
    fullName: 'Jane Viewer',
    role: 'Viewer',
    email: 'jane@power.com',
    lastLogin: new Date(Date.now() - 86400000),
    active: false
  }
];

export default function DemoSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [showPasswords, setShowPasswords] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // General Settings State
  const [generalConfig, setGeneralConfig] = useState({
    stationName: 'Substation Demo SCADA',
    stationCode: 'SS-001',
    location: 'Demo Location',
    refreshRate: 2,
    timezone: 'UTC',
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  });

  // Communication Settings State
  const [commConfig, setCommConfig] = useState({
    iec61850Port: 102,
    dnp3Port: 20000,
    modbusPort: 502,
    snmpPort: 161,
    maxConnections: 50,
    timeout: 5000,
    retries: 3,
    encryption: true
  });

  // Alarm Configuration State
  const [alarmConfig, setAlarmConfig] = useState({
    voltageHighHigh: 37.5,
    voltageHigh: 36.0,
    voltageLow: 30.0,
    voltageLowLow: 28.5,
    currentHigh: 280,
    temperatureHigh: 80,
    powerFactorLow: 0.8,
    emailNotifications: true,
    smsNotifications: false,
    soundAlarms: true
  });

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Station Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
            <input
              type="text"
              value={generalConfig.stationName}
              onChange={(e) => {
                setGeneralConfig(prev => ({ ...prev, stationName: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Station Code</label>
            <input
              type="text"
              value={generalConfig.stationCode}
              onChange={(e) => {
                setGeneralConfig(prev => ({ ...prev, stationCode: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={generalConfig.location}
              onChange={(e) => {
                setGeneralConfig(prev => ({ ...prev, location: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refresh Rate (seconds)</label>
            <select
              value={generalConfig.refreshRate}
              onChange={(e) => {
                setGeneralConfig(prev => ({ ...prev, refreshRate: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 second</option>
              <option value={2}>2 seconds</option>
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={generalConfig.timezone}
              onChange={(e) => {
                setGeneralConfig(prev => ({ ...prev, timezone: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="IST">India Standard Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={generalConfig.language}
              onChange={(e) => {
                setGeneralConfig(prev => ({ ...prev, language: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
            <select
              value={generalConfig.dateFormat}
              onChange={(e) => {
                setGeneralConfig(prev => ({ ...prev, dateFormat: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
            <select
              value={generalConfig.timeFormat}
              onChange={(e) => {
                setGeneralConfig(prev => ({ ...prev, timeFormat: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">24 Hour</option>
              <option value="12h">12 Hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunicationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Ports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IEC 61850 Port</label>
            <input
              type="number"
              value={commConfig.iec61850Port}
              onChange={(e) => {
                setCommConfig(prev => ({ ...prev, iec61850Port: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DNP3 Port</label>
            <input
              type="number"
              value={commConfig.dnp3Port}
              onChange={(e) => {
                setCommConfig(prev => ({ ...prev, dnp3Port: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modbus TCP Port</label>
            <input
              type="number"
              value={commConfig.modbusPort}
              onChange={(e) => {
                setCommConfig(prev => ({ ...prev, modbusPort: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SNMP Port</label>
            <input
              type="number"
              value={commConfig.snmpPort}
              onChange={(e) => {
                setCommConfig(prev => ({ ...prev, snmpPort: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Connections</label>
            <input
              type="number"
              value={commConfig.maxConnections}
              onChange={(e) => {
                setCommConfig(prev => ({ ...prev, maxConnections: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timeout (ms)</label>
            <input
              type="number"
              value={commConfig.timeout}
              onChange={(e) => {
                setCommConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Retry Attempts</label>
            <input
              type="number"
              value={commConfig.retries}
              onChange={(e) => {
                setCommConfig(prev => ({ ...prev, retries: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="encryption"
            checked={commConfig.encryption}
            onChange={(e) => {
              setCommConfig(prev => ({ ...prev, encryption: e.target.checked }));
              setHasUnsavedChanges(true);
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="encryption" className="text-sm font-medium text-gray-700">
            Enable TLS/SSL Encryption
          </label>
        </div>
      </div>
    </div>
  );

  const renderAlarmSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voltage Thresholds (kV)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">High High Alarm</label>
            <input
              type="number"
              step="0.1"
              value={alarmConfig.voltageHighHigh}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, voltageHighHigh: parseFloat(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">High Alarm</label>
            <input
              type="number"
              step="0.1"
              value={alarmConfig.voltageHigh}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, voltageHigh: parseFloat(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Alarm</label>
            <input
              type="number"
              step="0.1"
              value={alarmConfig.voltageLow}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, voltageLow: parseFloat(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Low Alarm</label>
            <input
              type="number"
              step="0.1"
              value={alarmConfig.voltageLowLow}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, voltageLowLow: parseFloat(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">High Current (A)</label>
            <input
              type="number"
              value={alarmConfig.currentHigh}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, currentHigh: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">High Temperature (°C)</label>
            <input
              type="number"
              value={alarmConfig.temperatureHigh}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, temperatureHigh: parseInt(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Power Factor</label>
            <input
              type="number"
              step="0.01"
              value={alarmConfig.powerFactorLow}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, powerFactorLow: parseFloat(e.target.value) }));
                setHasUnsavedChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={alarmConfig.emailNotifications}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, emailNotifications: e.target.checked }));
                setHasUnsavedChanges(true);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Mail className="w-4 h-4 text-gray-600" />
            <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
              Email Notifications
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="smsNotifications"
              checked={alarmConfig.smsNotifications}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, smsNotifications: e.target.checked }));
                setHasUnsavedChanges(true);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Phone className="w-4 h-4 text-gray-600" />
            <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700">
              SMS Notifications
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="soundAlarms"
              checked={alarmConfig.soundAlarms}
              onChange={(e) => {
                setAlarmConfig(prev => ({ ...prev, soundAlarms: e.target.checked }));
                setHasUnsavedChanges(true);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Bell className="w-4 h-4 text-gray-600" />
            <label htmlFor="soundAlarms" className="text-sm font-medium text-gray-700">
              Audible Alarms
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Accounts</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
          Add New User
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {DEMO_USERS.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm font-medium">{user.username}</td>
                <td className="px-6 py-4 text-sm">{user.fullName}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'Admin' 
                      ? 'bg-red-100 text-red-800'
                      : user.role === 'Operator'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {user.lastLogin.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Administrator</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full system access</li>
              <li>• User management</li>
              <li>• Configuration changes</li>
              <li>• Equipment control</li>
              <li>• Report generation</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Operator</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Equipment control</li>
              <li>• Alarm acknowledgment</li>
              <li>• View all displays</li>
              <li>• Generate reports</li>
              <li>• Limited configuration</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Viewer</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• View-only access</li>
              <li>• Monitor displays</li>
              <li>• View alarms</li>
              <li>• Generate reports</li>
              <li>• No control operations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'communication':
        return renderCommunicationSettings();
      case 'alarms':
        return renderAlarmSettings();
      case 'users':
        return renderUserManagement();
      case 'database':
        return (
          <div className="text-center py-12">
            <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Database configuration panel would be implemented here</p>
          </div>
        );
      case 'security':
        return (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Security configuration panel would be implemented here</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Settings Navigation */}
      <div className="w-80 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            System Configuration
          </h2>
          <p className="text-sm text-gray-600 mt-1">Manage system settings and preferences</p>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            {CONFIG_SECTIONS.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-50 border border-blue-200 text-blue-900' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{section.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{section.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {CONFIG_SECTIONS.find(s => s.id === activeSection)?.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {CONFIG_SECTIONS.find(s => s.id === activeSection)?.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
            <button
              onClick={() => setHasUnsavedChanges(false)}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => setHasUnsavedChanges(false)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>

      {/* Demo Banner */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-300 rounded-lg px-4 py-2">
        <div className="flex items-center gap-2 text-blue-800 text-sm">
          <Settings className="w-4 h-4" />
          <span className="font-medium">Demo Mode:</span>
          <span>Configuration changes are simulated</span>
        </div>
      </div>
    </div>
  );
}