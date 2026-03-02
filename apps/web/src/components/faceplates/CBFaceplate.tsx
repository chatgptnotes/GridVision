import BaseFaceplate from './BaseFaceplate';
import { useRealtimeStore } from '@/stores/realtimeStore';
import { api } from '@/services/api';

interface Props {
  element: any;
  x: number;
  y: number;
  onClose: () => void;
  onPin?: () => void;
  pinned?: boolean;
}

export default function CBFaceplate({ element, x, y, onClose, onPin, pinned }: Props) {
  const values = useRealtimeStore(s => s.values);
  const tag = element.properties?.tagBinding;
  const bindings = element.properties?.tagBindings || {};
  const tagVal = tag ? values[tag] : undefined;

  const statusVal = tagVal !== undefined ? tagVal : bindings.status ? values[bindings.status] : undefined;
  const isClosed = statusVal === true || statusVal === 'true' || statusVal === 1 || statusVal === '1' || statusVal === 'CLOSED';
  const isTripping = statusVal === 'TRIPPING';

  const statusColor = isTripping ? '#EAB308' : isClosed ? '#22C55E' : '#EF4444';
  const statusText = isTripping ? 'TRIPPING' : isClosed ? 'CLOSED' : 'OPEN';

  const handleControl = async (action: string) => {
    const targetTag = tag || bindings.control;
    if (!targetTag) return;
    const val = action === 'CLOSE' ? true : action === 'OPEN' ? false : 0;
    try { await api.post('/tags/by-name/set-value', { tagName: targetTag, value: val }); } catch {}
  };

  const loadCurrent = bindings.loadCurrent ? values[bindings.loadCurrent] : undefined;
  const tripCount = bindings.tripCount ? values[bindings.tripCount] : undefined;

  return (
    <BaseFaceplate title={element.properties?.label || element.type} type="Circuit Breaker" x={x} y={y} onClose={onClose} onPin={onPin} pinned={pinned}>
      {/* Status indicator */}
      <div className="flex items-center justify-center mb-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center" style={{ borderColor: statusColor, backgroundColor: `${statusColor}22` }}>
            <span className="text-xs font-bold" style={{ color: statusColor }}>{statusText}</span>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-1.5 mb-3">
        {loadCurrent !== undefined && (
          <div className="flex justify-between"><span className="text-gray-400">Load Current</span><span className="text-white font-mono">{Number(loadCurrent).toFixed(1)} A</span></div>
        )}
        {tripCount !== undefined && (
          <div className="flex justify-between"><span className="text-gray-400">Trip Count</span><span className="text-white font-mono">{tripCount}</span></div>
        )}
        {tag && tagVal !== undefined && (
          <div className="flex justify-between"><span className="text-gray-400">Tag Value</span><span className="text-white font-mono">{String(tagVal)}</span></div>
        )}
      </div>

      {/* Nameplate */}
      {element.properties?.ratedVoltage && (
        <div className="border-t border-gray-700 pt-2 mb-3">
          <div className="text-gray-500 text-[10px] font-semibold mb-1">NAMEPLATE</div>
          <div className="grid grid-cols-2 gap-1">
            {element.properties.ratedVoltage && <div className="text-gray-400">Rated V: <span className="text-white">{element.properties.ratedVoltage}</span></div>}
            {element.properties.ratedCurrent && <div className="text-gray-400">Rated I: <span className="text-white">{element.properties.ratedCurrent}</span></div>}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 border-t border-gray-700 pt-2">
        <button onClick={() => handleControl('CLOSE')} className="flex-1 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-semibold">CLOSE</button>
        <button onClick={() => handleControl('OPEN')} className="flex-1 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded text-xs font-semibold">OPEN</button>
        <button onClick={() => handleControl('RESET')} className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-semibold">RESET</button>
      </div>
    </BaseFaceplate>
  );
}
