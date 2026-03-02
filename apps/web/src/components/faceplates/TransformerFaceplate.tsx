import BaseFaceplate from './BaseFaceplate';
import { useRealtimeStore } from '@/stores/realtimeStore';
import { api } from '@/services/api';

interface Props { element: any; x: number; y: number; onClose: () => void; onPin?: () => void; pinned?: boolean; }

export default function TransformerFaceplate({ element, x, y, onClose, onPin, pinned }: Props) {
  const values = useRealtimeStore(s => s.values);
  const b = element.properties?.tagBindings || {};

  const hvV = b.hvVoltage ? values[b.hvVoltage] : undefined;
  const lvV = b.lvVoltage ? values[b.lvVoltage] : undefined;
  const load = b.load ? values[b.load] : undefined;
  const temp = b.temperature ? values[b.temperature] : undefined;
  const oil = b.oilLevel ? values[b.oilLevel] : undefined;
  const tap = b.tapPosition ? values[b.tapPosition] : undefined;

  const handleTap = async (dir: 'raise' | 'lower') => {
    if (!b.tapPosition) return;
    const curr = Number(tap) || 0;
    await api.post('/tags/by-name/set-value', { tagName: b.tapPosition, value: dir === 'raise' ? curr + 1 : curr - 1 }).catch(() => {});
  };

  return (
    <BaseFaceplate title={element.properties?.label || 'Transformer'} type="Transformer" x={x} y={y} onClose={onClose} onPin={onPin} pinned={pinned}>
      {/* Simple winding diagram */}
      <div className="flex justify-center mb-3">
        <svg width="80" height="60" viewBox="0 0 80 60">
          <circle cx="30" cy="30" r="18" fill="none" stroke="#60A5FA" strokeWidth="2" />
          <circle cx="50" cy="30" r="18" fill="none" stroke="#34D399" strokeWidth="2" />
          <text x="22" y="34" fontSize="10" fill="#60A5FA" fontWeight="bold">HV</text>
          <text x="42" y="34" fontSize="10" fill="#34D399" fontWeight="bold">LV</text>
        </svg>
      </div>

      <div className="space-y-1.5 mb-3">
        {hvV !== undefined && <div className="flex justify-between"><span className="text-gray-400">HV Voltage</span><span className="text-blue-400 font-mono">{Number(hvV).toFixed(1)} kV</span></div>}
        {lvV !== undefined && <div className="flex justify-between"><span className="text-gray-400">LV Voltage</span><span className="text-green-400 font-mono">{Number(lvV).toFixed(1)} kV</span></div>}
        {load !== undefined && <div className="flex justify-between"><span className="text-gray-400">Load</span><span className="text-white font-mono">{Number(load).toFixed(2)} MVA</span></div>}
        {temp !== undefined && <div className="flex justify-between"><span className="text-gray-400">Temperature</span><span className="text-orange-400 font-mono">{Number(temp).toFixed(1)} °C</span></div>}
        {oil !== undefined && <div className="flex justify-between"><span className="text-gray-400">Oil Level</span><span className="text-white font-mono">{Number(oil).toFixed(0)}%</span></div>}
      </div>

      {/* Tap changer */}
      {b.tapPosition && (
        <div className="border-t border-gray-700 pt-2 mb-3">
          <div className="text-gray-500 text-[10px] font-semibold mb-1">TAP CHANGER</div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleTap('lower')} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs">Lower</button>
            <span className="flex-1 text-center text-white font-mono font-bold">Tap: {tap ?? '—'}</span>
            <button onClick={() => handleTap('raise')} className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs">Raise</button>
          </div>
        </div>
      )}

      {/* Protection status */}
      <div className="border-t border-gray-700 pt-2">
        <div className="text-gray-500 text-[10px] font-semibold mb-1">PROTECTION</div>
        <div className="grid grid-cols-2 gap-1">
          {['buchholz', 'overcurrent', 'differential'].map(p => {
            const v = b[p] ? values[b[p]] : undefined;
            const ok = v === undefined || v === false || v === 0 || v === 'false';
            return <div key={p} className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} /><span className="text-gray-400 capitalize">{p}</span></div>;
          })}
        </div>
      </div>
    </BaseFaceplate>
  );
}
