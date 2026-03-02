import BaseFaceplate from './BaseFaceplate';
import { useRealtimeStore } from '@/stores/realtimeStore';
import { api } from '@/services/api';

interface Props { element: any; x: number; y: number; onClose: () => void; onPin?: () => void; pinned?: boolean; }

export default function MotorFaceplate({ element, x, y, onClose, onPin, pinned }: Props) {
  const values = useRealtimeStore(s => s.values);
  const b = element.properties?.tagBindings || {};
  const tag = element.properties?.tagBinding;

  const status = b.status ? values[b.status] : tag ? values[tag] : undefined;
  const isRunning = status === true || status === 'true' || status === 1 || status === 'RUNNING';
  const isFault = status === 'FAULT';

  const speed = b.speed ? values[b.speed] : undefined;
  const current = b.current ? values[b.current] : undefined;
  const power = b.power ? values[b.power] : undefined;
  const temp = b.temperature ? values[b.temperature] : undefined;

  const handleControl = async (action: string) => {
    const t = b.control || b.status || tag;
    if (!t) return;
    const val = action === 'START' ? true : action === 'FWD' ? 'FWD' : action === 'REV' ? 'REV' : false;
    await api.post('/tags/by-name/set-value', { tagName: t, value: val }).catch(() => {});
  };

  return (
    <BaseFaceplate title={element.properties?.label || 'Motor'} type="Motor" x={x} y={y} onClose={onClose} onPin={onPin} pinned={pinned}>
      <div className="flex items-center justify-center mb-3">
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${isRunning ? 'bg-green-900/50 text-green-400 border border-green-600' : isFault ? 'bg-red-900/50 text-red-400 border border-red-600 animate-pulse' : 'bg-gray-800 text-gray-400 border border-gray-600'}`}>
          {isFault ? 'FAULT' : isRunning ? 'RUNNING' : 'STOPPED'}
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        {speed !== undefined && <div className="flex justify-between"><span className="text-gray-400">Speed</span><span className="text-white font-mono">{Number(speed).toFixed(0)} RPM</span></div>}
        {current !== undefined && <div className="flex justify-between"><span className="text-gray-400">Current</span><span className="text-white font-mono">{Number(current).toFixed(1)} A</span></div>}
        {power !== undefined && <div className="flex justify-between"><span className="text-gray-400">Power</span><span className="text-white font-mono">{Number(power).toFixed(1)} kW</span></div>}
        {temp !== undefined && <div className="flex justify-between"><span className="text-gray-400">Temp</span><span className="text-orange-400 font-mono">{Number(temp).toFixed(1)} °C</span></div>}
      </div>

      {/* Protection */}
      <div className="border-t border-gray-700 pt-2 mb-3">
        <div className="text-gray-500 text-[10px] font-semibold mb-1">PROTECTION</div>
        <div className="grid grid-cols-2 gap-1">
          {['overload', 'earthFault', 'stall'].map(p => {
            const v = b[p] ? values[b[p]] : undefined;
            const ok = v === undefined || v === false || v === 0;
            return <div key={p} className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} /><span className="text-gray-400 capitalize">{p.replace(/([A-Z])/g, ' $1')}</span></div>;
          })}
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-700 pt-2">
        <button onClick={() => handleControl('START')} className="flex-1 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-semibold">START</button>
        <button onClick={() => handleControl('STOP')} className="flex-1 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded text-xs font-semibold">STOP</button>
        <button onClick={() => handleControl('FWD')} className="flex-1 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold">FWD</button>
        <button onClick={() => handleControl('REV')} className="flex-1 py-1.5 bg-yellow-700 hover:bg-yellow-600 text-white rounded text-xs font-semibold">REV</button>
      </div>
    </BaseFaceplate>
  );
}
