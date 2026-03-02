import BaseFaceplate from './BaseFaceplate';
import { useRealtimeStore } from '@/stores/realtimeStore';
import { api } from '@/services/api';

interface Props { element: any; x: number; y: number; onClose: () => void; onPin?: () => void; pinned?: boolean; }

export default function GenericFaceplate({ element, x, y, onClose, onPin, pinned }: Props) {
  const values = useRealtimeStore(s => s.values);
  const tag = element.properties?.tagBinding;
  const bindings = element.properties?.tagBindings || {};

  const handleControl = async () => {
    const t = element.properties?.targetTag || tag;
    if (!t) return;
    const v = element.properties?.controlValue;
    await api.post('/tags/by-name/set-value', { tagName: t, value: v ?? true }).catch(() => {});
  };

  return (
    <BaseFaceplate title={element.properties?.label || element.type} type={element.type} x={x} y={y} onClose={onClose} onPin={onPin} pinned={pinned}>
      {/* Tag bindings */}
      <div className="space-y-1.5 mb-3">
        {tag && (
          <div className="flex justify-between">
            <span className="text-gray-400">Primary Tag</span>
            <span className="text-white font-mono">{values[tag] !== undefined ? String(values[tag]) : '—'}</span>
          </div>
        )}
        {Object.entries(bindings).map(([key, tagName]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-white font-mono">{values[tagName as string] !== undefined ? String(values[tagName as string]) : '—'}</span>
          </div>
        ))}
      </div>

      {/* Properties */}
      <div className="border-t border-gray-700 pt-2 mb-3 space-y-1">
        <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="text-gray-300">{element.type}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Position</span><span className="text-gray-300">{element.x}, {element.y}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Size</span><span className="text-gray-300">{element.width}×{element.height}</span></div>
      </div>

      {/* Control */}
      {(element.properties?.targetTag || element.properties?.controlAction) && (
        <div className="border-t border-gray-700 pt-2">
          <button onClick={handleControl} className="w-full py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-semibold">
            Execute Control
          </button>
        </div>
      )}
    </BaseFaceplate>
  );
}
