import { useState } from 'react';
import { useSimulationContext } from './DemoSimulationContext';
import { 
  Server, Wifi, WifiOff, Clock, Search, Filter, 
  Settings, Activity, AlertTriangle, CheckCircle,
  Radio, Zap, Shield
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  protocol: string;
  ipAddress: string;
  port: number;
  status: 'Online' | 'Offline' | 'Error';
  lastPoll: Date;
  tagCount: number;
  manufacturer: string;
  model: string;
  commStats: {
    successRate: number;
    avgLatency: number;
    errorCount: number;
    totalPolls: number;
  };
}

const MOCK_DEVICES: Device[] = [
  {
    id: 'RTU_001',
    name: '33kV Incomer RTU',
    type: 'RTU',
    protocol: 'IEC 61850',
    ipAddress: '192.168.1.10',
    port: 102,
    status: 'Online',
    lastPoll: new Date(Date.now() - 2000),
    tagCount: 24,
    manufacturer: 'ABB',
    model: 'RTU560',
    commStats: {
      successRate: 99.2,
      avgLatency: 12,
      errorCount: 3,
      totalPolls: 1247
    }
  },
  {
    id: 'RTU_002',
    name: 'TR1 Protection RTU',
    type: 'Protection Relay',
    protocol: 'IEC 61850',
    ipAddress: '192.168.1.11',
    port: 102,
    status: 'Online',
    lastPoll: new Date(Date.now() - 1500),
    tagCount: 18,
    manufacturer: 'Schneider',
    model: 'P543',
    commStats: {
      successRate: 98.8,
      avgLatency: 8,
      errorCount: 5,
      totalPolls: 1156
    }
  },
  {
    id: 'RTU_003',
    name: 'TR2 Protection RTU',
    type: 'Protection Relay',
    protocol: 'IEC 61850',
    ipAddress: '192.168.1.12',
    port: 102,
    status: 'Online',
    lastPoll: new Date(Date.now() - 3000),
    tagCount: 18,
    manufacturer: 'Schneider',
    model: 'P543',
    commStats: {
      successRate: 97.5,
      avgLatency: 15,
      errorCount: 12,
      totalPolls: 1089
    }
  },
  {
    id: 'RTU_004',
    name: '11kV Feeder RTU',
    type: 'RTU',
    protocol: 'DNP3',
    ipAddress: '192.168.1.15',
    port: 20000,
    status: 'Online',
    lastPoll: new Date(Date.now() - 1000),
    tagCount: 42,
    manufacturer: 'GE',
    model: 'D20MX',
    commStats: {
      successRate: 99.7,
      avgLatency: 6,
      errorCount: 1,
      totalPolls: 1456
    }
  },
  {
    id: 'METER_001',
    name: 'Incomer Energy Meter',
    type: 'Energy Meter',
    protocol: 'Modbus TCP',
    ipAddress: '192.168.1.20',
    port: 502,
    status: 'Online',
    lastPoll: new Date(Date.now() - 4000),
    tagCount: 32,
    manufacturer: 'Schneider',
    model: 'PM8000',
    commStats: {
      successRate: 96.3,
      avgLatency: 25,
      errorCount: 18,
      totalPolls: 987
    }
  },
  {
    id: 'METER_002',
    name: 'TR1 Power Meter',
    type: 'Energy Meter', 
    protocol: 'Modbus TCP',
    ipAddress: '192.168.1.21',
    port: 502,
    status: 'Online',
    lastPoll: new Date(Date.now() - 2500),
    tagCount: 28,
    manufacturer: 'ABB',
    model: 'M2M',
    commStats: {
      successRate: 98.1,
      avgLatency: 18,
      errorCount: 7,
      totalPolls: 876
    }
  },
  {
    id: 'METER_003',
    name: 'TR2 Power Meter',
    type: 'Energy Meter',
    protocol: 'Modbus TCP',
    ipAddress: '192.168.1.22',
    port: 502,
    status: 'Error',
    lastPoll: new Date(Date.now() - 180000),
    tagCount: 28,
    manufacturer: 'ABB', 
    model: 'M2M',
    commStats: {
      successRate: 45.2,
      avgLatency: 250,
      errorCount: 156,
      totalPolls: 543
    }
  },
  {
    id: 'BCU_001',
    name: 'Bay Control Unit 1',
    type: 'BCU',
    protocol: 'IEC 61850',
    ipAddress: '192.168.1.30',
    port: 102,
    status: 'Online',
    lastPoll: new Date(Date.now() - 1800),
    tagCount: 16,
    manufacturer: 'Siemens',
    model: 'SICAM A8000',
    commStats: {
      successRate: 99.5,
      avgLatency: 10,
      errorCount: 2,
      totalPolls: 1345
    }
  },
  {
    id: 'BCU_002',
    name: 'Bay Control Unit 2', 
    type: 'BCU',
    protocol: 'IEC 61850',
    ipAddress: '192.168.1.31',
    port: 102,
    status: 'Online',
    lastPoll: new Date(Date.now() - 2200),
    tagCount: 16,
    manufacturer: 'Siemens',
    model: 'SICAM A8000',
    commStats: {
      successRate: 98.9,
      avgLatency: 11,
      errorCount: 4,
      totalPolls: 1298
    }
  },
  {
    id: 'RTU_005',
    name: 'Weather Station RTU',
    type: 'Weather Station',
    protocol: 'Modbus RTU',
    ipAddress: '192.168.1.50',
    port: 502,
    status: 'Online',
    lastPoll: new Date(Date.now() - 30000),
    tagCount: 8,
    manufacturer: 'Campbell Scientific',
    model: 'CR1000X',
    commStats: {
      successRate: 94.8,
      avgLatency: 45,
      errorCount: 23,
      totalPolls: 456
    }
  },
  {
    id: 'GATEWAY_001',
    name: 'Protocol Gateway',
    type: 'Gateway',
    protocol: 'Multi-Protocol',
    ipAddress: '192.168.1.100',
    port: 502,
    status: 'Offline',
    lastPoll: new Date(Date.now() - 300000),
    tagCount: 0,
    manufacturer: 'Moxa',
    model: 'MGate 5105',
    commStats: {
      successRate: 0,
      avgLatency: 0,
      errorCount: 87,
      totalPolls: 87
    }
  },
  {
    id: 'UPS_001',
    name: 'Control Room UPS',
    type: 'UPS',
    protocol: 'SNMP',
    ipAddress: '192.168.1.60',
    port: 161,
    status: 'Online',
    lastPoll: new Date(Date.now() - 60000),
    tagCount: 12,
    manufacturer: 'APC',
    model: 'Smart-UPS',
    commStats: {
      successRate: 99.9,
      avgLatency: 5,
      errorCount: 0,
      totalPolls: 234
    }
  }
];

export default function DemoDeviceManagerPage() {
  const { measurements } = useSimulationContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Online' | 'Offline' | 'Error'>('All');
  const [filterProtocol, setFilterProtocol] = useState<'All' | 'IEC 61850' | 'DNP3' | 'Modbus TCP' | 'Modbus RTU' | 'SNMP'>('All');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const filteredDevices = MOCK_DEVICES.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.ipAddress.includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || device.status === filterStatus;
    const matchesProtocol = filterProtocol === 'All' || device.protocol === filterProtocol;
    
    return matchesSearch && matchesStatus && matchesProtocol;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Offline':
        return <WifiOff className="w-4 h-4 text-gray-400" />;
      case 'Error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RTU':
        return <Server className="w-4 h-4 text-blue-600" />;
      case 'Protection Relay':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'Energy Meter':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case 'BCU':
        return <Radio className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatLastPoll = (lastPoll: Date) => {
    const diffMs = Date.now() - lastPoll.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Device Manager</h2>
          <p className="text-gray-600 mt-1">Communication devices and RTU status monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 text-green-600">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            {MOCK_DEVICES.filter(d => d.status === 'Online').length} Online
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            {MOCK_DEVICES.filter(d => d.status === 'Offline' || d.status === 'Error').length} Offline/Error
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search devices or IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Error">Error</option>
            </select>
          </div>
          <div>
            <select
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Protocols</option>
              <option value="IEC 61850">IEC 61850</option>
              <option value="DNP3">DNP3</option>
              <option value="Modbus TCP">Modbus TCP</option>
              <option value="Modbus RTU">Modbus RTU</option>
              <option value="SNMP">SNMP</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="w-4 h-4 mr-1" />
            {filteredDevices.length} of {MOCK_DEVICES.length} devices
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Protocol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Poll</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDevices.map(device => (
                  <tr 
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(device.type)}
                        <div>
                          <div className="font-medium text-sm text-gray-900">{device.name}</div>
                          <div className="text-xs text-gray-500">{device.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{device.protocol}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {device.ipAddress}:{device.port}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(device.status)}
                        <span className={`text-sm font-medium ${
                          device.status === 'Online' 
                            ? 'text-green-600' 
                            : device.status === 'Error'
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}>
                          {device.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatLastPoll(device.lastPoll)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{device.tagCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Details */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Device Details</h3>
          </div>
          {selectedDevice ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                {getTypeIcon(selectedDevice.type)}
                <div>
                  <div className="font-semibold">{selectedDevice.name}</div>
                  <div className="text-sm text-gray-600">{selectedDevice.type}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Status</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedDevice.status)}
                      <span className="text-sm font-medium">{selectedDevice.status}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Protocol</div>
                    <div className="text-sm font-medium mt-1">{selectedDevice.protocol}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 uppercase font-medium">Network</div>
                  <div className="text-sm font-mono mt-1">{selectedDevice.ipAddress}:{selectedDevice.port}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Manufacturer</div>
                    <div className="text-sm font-medium mt-1">{selectedDevice.manufacturer}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Model</div>
                    <div className="text-sm font-medium mt-1">{selectedDevice.model}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 uppercase font-medium">Tags</div>
                  <div className="text-sm font-medium mt-1">{selectedDevice.tagCount} active tags</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 uppercase font-medium">Last Poll</div>
                  <div className="text-sm font-medium mt-1">{formatLastPoll(selectedDevice.lastPoll)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Communication Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-sm font-medium">{selectedDevice.commStats.successRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${selectedDevice.commStats.successRate}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-gray-600">Avg Latency</div>
                      <div className="text-lg font-semibold">{selectedDevice.commStats.avgLatency}ms</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total Polls</div>
                      <div className="text-lg font-semibold">{selectedDevice.commStats.totalPolls.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Errors</div>
                      <div className="text-lg font-semibold text-red-600">{selectedDevice.commStats.errorCount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Error Rate</div>
                      <div className="text-lg font-semibold">
                        {((selectedDevice.commStats.errorCount / selectedDevice.commStats.totalPolls) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Settings className="w-4 h-4" />
                  Configure Device
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Server className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p>Select a device to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {MOCK_DEVICES.filter(d => d.status === 'Online').length}
              </div>
              <div className="text-sm text-gray-600">Devices Online</div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {MOCK_DEVICES.reduce((sum, d) => sum + d.tagCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Tags</div>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {(MOCK_DEVICES.filter(d => d.status === 'Online').reduce((sum, d) => sum + d.commStats.successRate, 0) / 
                  MOCK_DEVICES.filter(d => d.status === 'Online').length).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Avg Success Rate</div>
            </div>
            <Wifi className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {(MOCK_DEVICES.filter(d => d.status === 'Online').reduce((sum, d) => sum + d.commStats.avgLatency, 0) / 
                  MOCK_DEVICES.filter(d => d.status === 'Online').length).toFixed(0)}ms
              </div>
              <div className="text-sm text-gray-600">Avg Latency</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}