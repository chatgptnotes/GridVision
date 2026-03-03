import { useState, useEffect, useMemo } from 'react';
import { useSimulationContext } from './DemoSimulationContext';
import { 
  Calendar, Filter, AlertTriangle, Info, Zap, Settings,
  User, Activity, Clock, Search, ChevronDown, Download
} from 'lucide-react';

interface SystemEvent {
  id: string;
  timestamp: Date;
  type: 'CB Operations' | 'Alarms' | 'User Actions' | 'System Events' | 'Communication Events';
  severity: 'Critical' | 'Warning' | 'Info' | 'Normal';
  equipment: string;
  message: string;
  operator?: string;
  acknowledged?: boolean;
  details?: Record<string, any>;
}

const generateMockEvents = (): SystemEvent[] => {
  const events: SystemEvent[] = [];
  const now = new Date();
  
  // Generate events for the last 24 hours
  for (let i = 0; i < 25; i++) {
    const baseTime = new Date(now.getTime() - (i * 3600000) - Math.random() * 3600000);
    
    // CB Operations
    if (Math.random() > 0.7) {
      events.push({
        id: `cb_${i}_1`,
        timestamp: new Date(baseTime.getTime() - Math.random() * 1800000),
        type: 'CB Operations',
        severity: 'Info',
        equipment: `FDR${String(Math.floor(Math.random() * 6) + 1).padStart(2, '0')}_CB`,
        message: 'Circuit breaker operated OPEN by protection',
        operator: 'AUTO_PROTECTION',
        details: {
          operation: 'OPEN',
          trigger: 'Overcurrent Protection',
          current: 245.6
        }
      });
    }
    
    if (Math.random() > 0.8) {
      events.push({
        id: `cb_${i}_2`,
        timestamp: new Date(baseTime.getTime() - Math.random() * 1800000),
        type: 'CB Operations',
        severity: 'Normal',
        equipment: `FDR${String(Math.floor(Math.random() * 6) + 1).padStart(2, '0')}_CB`,
        message: 'Circuit breaker operated CLOSE by operator',
        operator: 'admin',
        details: {
          operation: 'CLOSE',
          trigger: 'Manual Command'
        }
      });
    }
    
    // Alarms
    if (Math.random() > 0.6) {
      const alarmTypes = [
        { equipment: 'TR1', message: 'Oil temperature high warning', severity: 'Warning' as const },
        { equipment: 'TR2', message: 'Load current above 90%', severity: 'Warning' as const },
        { equipment: 'System', message: 'Voltage deviation detected', severity: 'Critical' as const },
        { equipment: 'INC1', message: 'Power factor below threshold', severity: 'Info' as const }
      ];
      const alarm = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];
      
      events.push({
        id: `alarm_${i}`,
        timestamp: new Date(baseTime.getTime() - Math.random() * 1800000),
        type: 'Alarms',
        severity: alarm.severity,
        equipment: alarm.equipment,
        message: alarm.message,
        acknowledged: Math.random() > 0.5,
        details: {
          alarmCode: Math.floor(Math.random() * 9000) + 1000,
          priority: alarm.severity === 'Critical' ? 1 : alarm.severity === 'Warning' ? 2 : 3
        }
      });
    }
    
    // User Actions
    if (Math.random() > 0.8) {
      const userActions = [
        'User logged in to system',
        'User accessed reports module', 
        'User modified alarm setpoint',
        'User exported trend data',
        'User logged out of system'
      ];
      
      events.push({
        id: `user_${i}`,
        timestamp: new Date(baseTime.getTime() - Math.random() * 1800000),
        type: 'User Actions',
        severity: 'Info',
        equipment: 'System',
        message: userActions[Math.floor(Math.random() * userActions.length)],
        operator: Math.random() > 0.5 ? 'admin' : 'operator1',
        details: {
          sessionId: Math.random().toString(36).substr(2, 9),
          ipAddress: `192.168.1.${Math.floor(Math.random() * 50) + 200}`
        }
      });
    }
    
    // System Events
    if (Math.random() > 0.9) {
      const systemEvents = [
        { message: 'System startup completed', severity: 'Normal' as const },
        { message: 'Database backup completed', severity: 'Info' as const },
        { message: 'Watchdog timer reset', severity: 'Warning' as const },
        { message: 'Time synchronization successful', severity: 'Info' as const }
      ];
      const sysEvent = systemEvents[Math.floor(Math.random() * systemEvents.length)];
      
      events.push({
        id: `system_${i}`,
        timestamp: new Date(baseTime.getTime() - Math.random() * 1800000),
        type: 'System Events',
        severity: sysEvent.severity,
        equipment: 'System',
        message: sysEvent.message,
        details: {
          processId: Math.floor(Math.random() * 9000) + 1000
        }
      });
    }
    
    // Communication Events
    if (Math.random() > 0.7) {
      const commEvents = [
        { equipment: 'RTU_001', message: 'Communication restored', severity: 'Normal' as const },
        { equipment: 'RTU_002', message: 'Communication timeout', severity: 'Warning' as const },
        { equipment: 'METER_001', message: 'Device responding normally', severity: 'Info' as const },
        { equipment: 'GATEWAY_001', message: 'Connection failed', severity: 'Critical' as const }
      ];
      const commEvent = commEvents[Math.floor(Math.random() * commEvents.length)];
      
      events.push({
        id: `comm_${i}`,
        timestamp: new Date(baseTime.getTime() - Math.random() * 1800000),
        type: 'Communication Events',
        severity: commEvent.severity,
        equipment: commEvent.equipment,
        message: commEvent.message,
        details: {
          protocol: Math.random() > 0.5 ? 'IEC 61850' : 'Modbus TCP',
          retryCount: Math.floor(Math.random() * 5)
        }
      });
    }
  }
  
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function DemoEventLogPage() {
  const { alarms } = useSimulationContext();
  const [events] = useState<SystemEvent[]>(generateMockEvents());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | SystemEvent['type']>('All');
  const [filterSeverity, setFilterSeverity] = useState<'All' | SystemEvent['severity']>('All');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | 'all'>('24h');
  const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.operator?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by type
    if (filterType !== 'All') {
      filtered = filtered.filter(event => event.type === filterType);
    }
    
    // Filter by severity
    if (filterSeverity !== 'All') {
      filtered = filtered.filter(event => event.severity === filterSeverity);
    }
    
    // Filter by time range
    const now = new Date();
    if (timeRange !== 'all') {
      const hours = timeRange === '1h' ? 1 : timeRange === '6h' ? 6 : 24;
      const cutoff = new Date(now.getTime() - (hours * 3600000));
      filtered = filtered.filter(event => event.timestamp >= cutoff);
    }
    
    return filtered;
  }, [events, searchTerm, filterType, filterSeverity, timeRange]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Normal':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Info':
        return <Info className="w-4 h-4" />;
      case 'Normal':
        return <Activity className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CB Operations':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'Alarms':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'User Actions':
        return <User className="w-4 h-4 text-green-600" />;
      case 'System Events':
        return <Settings className="w-4 h-4 text-purple-600" />;
      case 'Communication Events':
        return <Activity className="w-4 h-4 text-yellow-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
    }
  };

  const eventStats = useMemo(() => {
    const stats = {
      critical: filteredEvents.filter(e => e.severity === 'Critical').length,
      warning: filteredEvents.filter(e => e.severity === 'Warning').length,
      info: filteredEvents.filter(e => e.severity === 'Info').length,
      normal: filteredEvents.filter(e => e.severity === 'Normal').length
    };
    return stats;
  }, [filteredEvents]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Log</h2>
          <p className="text-gray-600 mt-1">System events and operation history</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-900">{eventStats.critical}</div>
              <div className="text-sm text-gray-600">Critical Events</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-900">{eventStats.warning}</div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">{eventStats.info}</div>
              <div className="text-sm text-gray-600">Information</div>
            </div>
            <Info className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">{eventStats.normal}</div>
              <div className="text-sm text-gray-600">Normal Events</div>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="CB Operations">CB Operations</option>
              <option value="Alarms">Alarms</option>
              <option value="User Actions">User Actions</option>
              <option value="System Events">System Events</option>
              <option value="Communication Events">Communication Events</option>
            </select>
          </div>

          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Info">Information</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last 1 Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="w-4 h-4 mr-1" />
            {filteredEvents.length} events
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedEvent?.id === event.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(event.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(event.severity)}`}>
                            {getSeverityIcon(event.severity)}
                            <span className="ml-1">{event.severity}</span>
                          </span>
                          <span className="text-xs text-gray-500">{event.type}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-900 mb-1">{event.message}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Equipment: {event.equipment}</span>
                        {event.operator && <span>Operator: {event.operator}</span>}
                        {event.acknowledged !== undefined && (
                          <span className={event.acknowledged ? 'text-green-600' : 'text-red-600'}>
                            {event.acknowledged ? 'Acknowledged' : 'Unacknowledged'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Event Details</h3>
          </div>
          
          {selectedEvent ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                {getTypeIcon(selectedEvent.type)}
                <span className="font-medium">{selectedEvent.type}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-medium">Severity</div>
                  <div className={`inline-flex px-2 py-1 text-sm font-medium rounded-full border mt-1 ${getSeverityColor(selectedEvent.severity)}`}>
                    {getSeverityIcon(selectedEvent.severity)}
                    <span className="ml-1">{selectedEvent.severity}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 uppercase font-medium">Message</div>
                  <div className="text-sm mt-1">{selectedEvent.message}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Equipment</div>
                    <div className="text-sm font-medium mt-1">{selectedEvent.equipment}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Timestamp</div>
                    <div className="text-sm font-medium mt-1">
                      {selectedEvent.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>

                {selectedEvent.operator && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Operator</div>
                    <div className="text-sm font-medium mt-1">{selectedEvent.operator}</div>
                  </div>
                )}

                {selectedEvent.acknowledged !== undefined && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium">Status</div>
                    <div className={`text-sm font-medium mt-1 ${
                      selectedEvent.acknowledged ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedEvent.acknowledged ? 'Acknowledged' : 'Unacknowledged'}
                    </div>
                  </div>
                )}

                {selectedEvent.details && Object.keys(selectedEvent.details).length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase font-medium mb-2">Additional Details</div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      {Object.entries(selectedEvent.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedEvent.type === 'Alarms' && selectedEvent.acknowledged === false && (
                <div className="border-t pt-4">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Acknowledge Alarm
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p>Select an event to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}