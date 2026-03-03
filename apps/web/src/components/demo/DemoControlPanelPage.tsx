import { useState, useCallback } from 'react';
import { useSimulationContext } from './DemoSimulationContext';
import { 
  Power, AlertCircle, Clock, CheckCircle, XCircle, 
  Zap, Lock, Unlock, Play, Square 
} from 'lucide-react';

interface CommandHistoryEntry {
  id: string;
  timestamp: Date;
  equipment: string;
  command: string;
  status: 'Success' | 'Failed' | 'Pending';
  operator: string;
}

export default function DemoControlPanelPage() {
  const { 
    cbStates, 
    isolatorStates, 
    toggleCB, 
    toggleIsolator, 
    selectedEquipment,
    setSelectedEquipment,
    energizationState 
  } = useSimulationContext();
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<{ equipment: string; action: string } | null>(null);
  const [sboStep, setSboStep] = useState(1); // 1: Select, 2: Operate
  const [commandHistory, setCommandHistory] = useState<CommandHistoryEntry[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000),
      equipment: 'FDR03_CB',
      command: 'CLOSE',
      status: 'Success',
      operator: 'admin'
    },
    {
      id: '2', 
      timestamp: new Date(Date.now() - 180000),
      equipment: 'TR1_HV_ISO',
      command: 'OPEN',
      status: 'Failed',
      operator: 'admin'
    }
  ]);

  const equipmentList = [
    { id: 'INC1_CB', name: 'Incomer 1 CB', type: 'CB' },
    { id: 'BSC_CB', name: 'Bus Section CB', type: 'CB' },
    { id: 'TR1_HV_CB', name: 'TR1 HV CB', type: 'CB' },
    { id: 'TR1_LV_CB', name: 'TR1 LV CB', type: 'CB' },
    { id: 'TR2_HV_CB', name: 'TR2 HV CB', type: 'CB' },
    { id: 'TR2_LV_CB', name: 'TR2 LV CB', type: 'CB' },
    { id: 'BC_CB', name: 'Bus Coupler CB', type: 'CB' },
    { id: 'FDR01_CB', name: 'Feeder 01 CB', type: 'CB' },
    { id: 'FDR02_CB', name: 'Feeder 02 CB', type: 'CB' },
    { id: 'FDR03_CB', name: 'Feeder 03 CB', type: 'CB' },
    { id: 'FDR04_CB', name: 'Feeder 04 CB', type: 'CB' },
    { id: 'FDR05_CB', name: 'Feeder 05 CB', type: 'CB' },
    { id: 'FDR06_CB', name: 'Feeder 06 CB', type: 'CB' },
    { id: 'INC1_ISO', name: 'Incomer 1 ISO', type: 'ISO' },
    { id: 'TR1_HV_ISO', name: 'TR1 HV ISO', type: 'ISO' },
    { id: 'TR1_LV_ISO', name: 'TR1 LV ISO', type: 'ISO' },
    { id: 'TR2_HV_ISO', name: 'TR2 HV ISO', type: 'ISO' },
    { id: 'TR2_LV_ISO', name: 'TR2 LV ISO', type: 'ISO' },
  ];

  const getEquipmentStatus = (id: string, type: string) => {
    if (type === 'CB') {
      const state = cbStates[id];
      return state === 'CLOSED' ? 'CLOSED' : state === 'OPEN' ? 'OPEN' : 'TRIPPED';
    } else {
      return isolatorStates[id] ? 'CLOSED' : 'OPEN';
    }
  };

  const getInterlockStatus = (id: string, type: string, action: string) => {
    // Simple interlock logic
    if (type === 'ISO' && action === 'OPEN') {
      // Can't open isolator if corresponding CB is closed
      const cbId = id.replace('_ISO', '_CB');
      if (cbStates[cbId] === 'CLOSED') {
        return { allowed: false, reason: 'CB must be open before isolator operation' };
      }
    }
    
    if (type === 'CB' && action === 'CLOSE') {
      // Can't close CB if isolators are open
      const isoId = id.replace('_CB', '_ISO');
      if (isolatorStates[isoId] === false) {
        return { allowed: false, reason: 'Isolators must be closed before CB operation' };
      }
    }
    
    return { allowed: true, reason: '' };
  };

  const executeCommand = useCallback((equipment: string, action: string) => {
    const equipmentInfo = equipmentList.find(e => e.id === equipment);
    if (!equipmentInfo) return;

    const interlockCheck = getInterlockStatus(equipment, equipmentInfo.type, action);
    
    const newEntry: CommandHistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      equipment: equipmentInfo.name,
      command: action,
      status: interlockCheck.allowed ? 'Success' : 'Failed',
      operator: 'admin'
    };

    setCommandHistory(prev => [newEntry, ...prev.slice(0, 9)]);

    if (interlockCheck.allowed) {
      if (equipmentInfo.type === 'CB') {
        toggleCB(equipment);
      } else {
        toggleIsolator(equipment);
      }
    }

    setSboStep(1);
    setSelectedEquipment(null);
    setShowConfirmDialog(false);
    setPendingCommand(null);
  }, [cbStates, isolatorStates, toggleCB, toggleIsolator, equipmentList]);

  const handleOperateClick = (action: string) => {
    if (selectedEquipment && sboStep === 2) {
      setPendingCommand({ equipment: selectedEquipment, action });
      setShowConfirmDialog(true);
    }
  };

  const selectedEquipmentInfo = selectedEquipment 
    ? equipmentList.find(e => e.id === selectedEquipment) 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment Control</h2>
          <p className="text-gray-600 mt-1">Select Before Operate (SBO) control interface</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Control Enabled
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Selection */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Equipment List</h3>
            <p className="text-sm text-gray-600 mt-1">Select equipment to control</p>
          </div>
          <div className="p-4">
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {equipmentList.map(equipment => {
                const status = getEquipmentStatus(equipment.id, equipment.type);
                const isSelected = selectedEquipment === equipment.id;
                
                return (
                  <button
                    key={equipment.id}
                    onClick={() => {
                      setSelectedEquipment(equipment.id);
                      setSboStep(1);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${
                        equipment.type === 'CB' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {equipment.type === 'CB' ? <Power className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{equipment.name}</div>
                        <div className="text-xs text-gray-500">{equipment.type}</div>
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded font-medium ${
                      status === 'CLOSED' 
                        ? 'bg-green-100 text-green-700'
                        : status === 'TRIPPED'
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {status}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SBO Control Panel */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">SBO Control</h3>
            <p className="text-sm text-gray-600 mt-1">
              Step {sboStep}/2: {sboStep === 1 ? 'Select Equipment' : 'Execute Operation'}
            </p>
          </div>
          <div className="p-4">
            {selectedEquipmentInfo ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded">
                      {selectedEquipmentInfo.type === 'CB' ? (
                        <Power className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-blue-900">{selectedEquipmentInfo.name}</div>
                      <div className="text-sm text-blue-700">
                        Current Status: {getEquipmentStatus(selectedEquipmentInfo.id, selectedEquipmentInfo.type)}
                      </div>
                    </div>
                  </div>
                  
                  {sboStep === 1 && (
                    <button
                      onClick={() => setSboStep(2)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      SELECT (Proceed to Operate)
                    </button>
                  )}
                </div>

                {sboStep === 2 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleOperateClick('OPEN')}
                        className="flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-200 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        <Square className="w-4 h-4" />
                        OPEN
                      </button>
                      <button
                        onClick={() => handleOperateClick('CLOSE')}
                        className="flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-3 px-4 rounded-lg hover:bg-green-100 transition-colors font-medium"
                      >
                        <Play className="w-4 h-4" />
                        CLOSE
                      </button>
                    </div>
                    
                    {/* Interlock Status */}
                    {['OPEN', 'CLOSE'].map(action => {
                      const interlockStatus = getInterlockStatus(selectedEquipmentInfo.id, selectedEquipmentInfo.type, action);
                      if (!interlockStatus.allowed) {
                        return (
                          <div key={action} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                              <div>
                                <div className="text-sm font-medium text-yellow-900">{action} Operation Blocked</div>
                                <div className="text-sm text-yellow-700">{interlockStatus.reason}</div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Power className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p>Select equipment from the list to begin</p>
              </div>
            )}
          </div>
        </div>

        {/* Command History */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Command History</h3>
            <p className="text-sm text-gray-600 mt-1">Recent control operations</p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {commandHistory.map(entry => (
                <div key={entry.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        entry.status === 'Success' 
                          ? 'bg-green-500' 
                          : entry.status === 'Failed'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`} />
                      <span className="font-medium text-sm">{entry.equipment}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      entry.status === 'Success'
                        ? 'bg-green-100 text-green-700'
                        : entry.status === 'Failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Command: {entry.command}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.timestamp.toLocaleTimeString()}
                      </span>
                      <span>Operator: {entry.operator}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingCommand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h3 className="font-bold text-lg">Confirm Operation</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to <strong>{pendingCommand.action}</strong> the{' '}
              <strong>{equipmentList.find(e => e.id === pendingCommand.equipment)?.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => executeCommand(pendingCommand.equipment, pendingCommand.action)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingCommand(null);
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}