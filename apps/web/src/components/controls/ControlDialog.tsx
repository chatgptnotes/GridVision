import { useState } from 'react';
import { useControl } from '@/hooks/useControl';
import { useAuthStore } from '@/stores/authStore';
import type { CommandType } from '@ampris/shared';
import { X, AlertTriangle, Check, XCircle } from 'lucide-react';

interface Props {
  equipmentId: string;
  onClose: () => void;
}

export default function ControlDialog({ equipmentId, onClose }: Props) {
  const [selectedCommand, setSelectedCommand] = useState<CommandType>('OPEN');
  const { selectResponse, result, loading, error, select, execute, cancel, reset } = useControl();
  const user = useAuthStore((s) => s.user);

  const handleSelect = () => select(equipmentId, selectedCommand);

  const handleExecute = () => {
    if (selectResponse) execute(selectResponse.commandId);
  };

  const handleCancel = () => {
    if (selectResponse) cancel(selectResponse.commandId);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-scada-panel border border-scada-border rounded-lg w-[480px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-scada-border">
          <h3 className="font-semibold">Control Operation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Result display */}
          {result && (
            <div className={`p-3 rounded ${result.success ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
              <div className="flex items-center gap-2">
                {result.success ? <Check className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                <span className={result.success ? 'text-green-300' : 'text-red-300'}>{result.message}</span>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="p-3 rounded bg-red-900/30 border border-red-800 text-red-300 text-sm">{error}</div>
          )}

          {/* Select Response */}
          {selectResponse ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400">Equipment:</span> <span className="font-mono ml-1">{selectResponse.equipmentTag}</span></div>
                <div><span className="text-gray-400">Current State:</span> <span className="ml-1 font-bold">{selectResponse.currentState}</span></div>
                <div><span className="text-gray-400">Proposed Action:</span> <span className="ml-1 text-scada-warning font-bold">{selectResponse.proposedAction}</span></div>
                <div><span className="text-gray-400">Operator:</span> <span className="ml-1">{user?.name}</span></div>
              </div>

              {/* Interlock status */}
              <div className="space-y-1">
                <span className="text-xs text-gray-400">Interlock Status:</span>
                {selectResponse.interlockStatus.map((check, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm ${check.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {check.passed ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {check.description}
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div className="flex items-center gap-2 p-2 rounded bg-yellow-900/20 border border-yellow-800/50">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="text-xs text-yellow-300">
                  This action will change the equipment state. Timeout: {selectResponse.timeoutSeconds}s
                </span>
              </div>

              {/* Execute/Cancel buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleExecute}
                  disabled={loading}
                  className="flex-1 py-2 bg-scada-danger hover:bg-red-700 disabled:opacity-50 text-white font-medium rounded"
                >
                  {loading ? 'Executing...' : 'EXECUTE'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 bg-scada-border hover:bg-gray-600 text-white rounded"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : !result && (
            <div className="space-y-3">
              <div className="text-sm text-gray-400">Equipment ID: <span className="font-mono text-white">{equipmentId}</span></div>

              {/* Command selection */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Command</label>
                <div className="flex gap-2">
                  {(['OPEN', 'CLOSE'] as CommandType[]).map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => setSelectedCommand(cmd)}
                      className={`flex-1 py-2 rounded text-sm font-medium ${selectedCommand === cmd ? 'bg-scada-accent text-white' : 'bg-scada-bg border border-scada-border text-gray-400'}`}
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select button */}
              <button
                onClick={handleSelect}
                disabled={loading}
                className="w-full py-2 bg-scada-accent hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded"
              >
                {loading ? 'Selecting...' : 'SELECT'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
