import BaseFaceplate from './BaseFaceplate';
import { useRealtimeStore } from '@/stores/realtimeStore';
import { api } from '@/services/api';

interface Props { element: any; x: number; y: number; onClose: () => void; onPin?: () => void; pinned?: boolean; }

export default function GeneratorFaceplate({ element, x, y, onClose, onPin, pinned }: Props) {
  const values = useRealtimeStore(s => s.values);
  const b = element.properties?.tagBindings || {};
  const tag = element.properties?.tagBinding;

  const status = b.status ? values[b.status] : tag ? values[tag] : undefined;
  const isRunning = status === true || status === 'true' || status === 1 || status === 'RUNNING';
  const isFault = status === 'FAULT';

  const power = b.power ? values[b.power] : undefined;
  const reactivePower = b.reactivePower ? values[b.reactivePower] : undefined;
  const frequency = b.frequency ? values[b.frequency] : undefined;
  const voltage = b.voltage ? values[b.voltage] : undefined;
  const current = b.current ? values[b.current] : undefined;
  const pf = b.powerFactor ? values[b.powerFactor] : undefined;
  const temp = b.temperature ? values[b.temperature] : undefined;

  const handleControl = async (action: string) => {
    const t = b.control || b.status || tag;
    if (!t) return;
    const val = action === 'START' ? true : action === 'ESTOP' ? 'ESTOP' : false;
    await api.post('/tags/by-name/set-value', { tagName: t, value: val }).catch(() => {});
  };

  return (
    <BaseFaceplate title={element.properties?.label || 'Generator'} type="Generator" x={x} y={y} onClose={onClose} onPin={onPin} pinned={pinned}>
      <div className="flex items-center justify-center mb-3">
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${isRunning ? 'bg-green-900/50 text-green-400 border border-green-600' : isFault ? 'bg-red-900/50 text-red-400 border border-red-600 animate-pulse' : 'bg-gray-800 text-gray-400 border border-gray-600'}`}>
          {isFault ? 'FAULT' : isRunning ? 'RUNNING' : 'STOPPED'}
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        {power !== undefined && <div className="flex justify-between"><span className="text-gray-400">Power</span><span className="text-white font-mono">{Number(power).toFixed(2)} MW</span></div>}
        {reactivePower !== undefined && <div className="flex justify-between"><span className="text-gray-400">Reactive</span><span className="text-white font-mono">{Number(reactivePower).toFixed(2)} MVAR</span></div>}
        {frequency !== undefined && <div className="flex justify-between"><span className="text-gray-400">Frequency</span><span className="text-white font-mono">{Number(frequency).toFixed(2)} Hz</span></div>}
        {voltage !== undefined && <div className="flex justify-between"><span className="text-gray-400">Voltage</span><span className="text-white font-mono">{Number(voltage).toFixed(1)} kV</span></div>}
        {current !== undefined && <div className="flex justify-between"><span className="text-gray-400">Current</span><span className="text-white font-mono">{Number(current).toFixed(1)} A</span></div>}
        {pf !== undefined && <div className="flex justify-between"><span className="text-gray-400">PF</span><span className="text-white font-mono">{Number(pf).toFixed(3)}</span></div>}
        {temp !== undefined && <div className="flex justify-between"><span className="text-gray-400">Temp</span><span className="text-orange-400 font-mono">{Number(temp).toFixed(1)} °C</span></div>}
      </div>

      <div className="flex gap-2 border-t border-gray-700 pt-2">
        <button onClick={() => handleControl('START')} className="flex-1 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-semibold">START</button>
        <button onClick={() => handleControl('STOP')} className="flex-1 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-semibold">STOP</button>
        <button onClick={() => handleControl('ESTOP')} className="flex-1 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded text-xs font-semibold animate-pulse">E-STOP</button>
      </div>
    </BaseFaceplate>
  );
}
