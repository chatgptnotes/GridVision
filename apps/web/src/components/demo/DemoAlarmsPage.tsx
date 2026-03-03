import { useState } from 'react';
import { useSimulationContext } from './DemoSimulationContext';
import { AlertTriangle, Check, X, Volume2, VolumeX, Clock } from 'lucide-react';

const PRIORITY_CONFIG = {
  1: { label: 'P1 - Critical', color: '#DC2626', bgColor: '#FEE2E2' },
  2: { label: 'P2 - High', color: '#EA580C', bgColor: '#FED7AA' },
  3: { label: 'P3 - Medium', color: '#EAB308', bgColor: '#FEF3C7' },
} as const;

export default function DemoAlarmsPage() {
  const { alarms, acknowledgeAlarm, clearAlarm } = useSimulationContext();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const activeAlarms = alarms.filter(a => !showHistory || true); // For demo, show all
  const unacknowledgedCount = alarms.filter(a => !a.acknowledged).length;
  const criticalCount = alarms.filter(a => a.priority === 1).length;
  const highCount = alarms.filter(a => a.priority === 2).length;
  const mediumCount = alarms.filter(a => a.priority === 3).length;

  const handleAcknowledge = (alarmId: string) => {
    acknowledgeAlarm(alarmId);
  };

  const handleClear = (alarmId: string) => {
    clearAlarm(alarmId);
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alarm Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage substation alarms</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              soundEnabled 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            Sound {soundEnabled ? 'On' : 'Off'}
          </button>
          
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-3 py-2 rounded-lg text-sm border ${
              showHistory 
                ? 'bg-blue-100 text-blue-700 border-blue-300' 
                : 'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            {showHistory ? 'Active Only' : 'Show History'}
          </button>
        </div>
      </div>

      {/* Alarm statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-2xl font-bold text-gray-900">{alarms.length}</div>
          <div className="text-sm text-gray-600">Total Alarms</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-700">{unacknowledgedCount}</div>
          <div className="text-sm text-red-600">Unacknowledged</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-700">{criticalCount}</div>
          <div className="text-sm text-orange-600">P1 Critical</div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-700">{highCount + mediumCount}</div>
          <div className="text-sm text-yellow-600">P2-P3 Other</div>
        </div>
      </div>

      {/* Alarms table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Alarms ({activeAlarms.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {activeAlarms.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Check className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-gray-600">No active alarms</div>
              <div className="text-sm text-gray-500 mt-1">
                Wait for random feeder trips to generate alarms, or toggle circuit breakers manually
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Time</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Equipment</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Message</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Priority</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeAlarms.map((alarm) => {
                  const priorityConfig = PRIORITY_CONFIG[alarm.priority];
                  
                  return (
                    <tr 
                      key={alarm.id}
                      className={`${alarm.acknowledged ? 'bg-white' : 'bg-red-50'} hover:bg-gray-50 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {alarm.timestamp.toLocaleTimeString()}
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {alarm.equipment}
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {alarm.message}
                      </td>
                      
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            color: priorityConfig.color, 
                            backgroundColor: priorityConfig.bgColor 
                          }}
                        >
                          {priorityConfig.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs ${
                          alarm.acknowledged ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {alarm.acknowledged ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {alarm.acknowledged ? 'Acknowledged' : 'Unacknowledged'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!alarm.acknowledged && (
                            <button
                              onClick={() => handleAcknowledge(alarm.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                            >
                              ACK
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleClear(alarm.id)}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Clear
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5">ℹ️</div>
          <div>
            <h4 className="font-medium text-blue-900">Alarm System Information</h4>
            <p className="text-blue-700 text-sm mt-1">
              • New alarms are generated when feeders trip randomly (~15 seconds)
              <br />
              • Manually toggle circuit breakers on the SLD page to create alarm conditions
              <br />
              • <strong>ACK</strong> acknowledges an alarm (stops blinking, changes color)
              <br />
              • <strong>Clear</strong> removes the alarm from the active list
              <br />
              • Priority: P1 = Critical (red), P2 = High (orange), P3 = Medium (yellow)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}