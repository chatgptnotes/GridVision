import { useMemo } from 'react';
import BaseFaceplate from './BaseFaceplate';
import { useRealtimeStore } from '@/stores/realtimeStore';

interface Props { element: any; x: number; y: number; onClose: () => void; onPin?: () => void; pinned?: boolean; }

export default function MeterFaceplate({ element, x, y, onClose, onPin, pinned }: Props) {
  const values = useRealtimeStore(s => s.values);
  const tag = element.properties?.tagBinding;
  const bindings = element.properties?.tagBindings || {};
  const primaryValue = tag ? values[tag] : undefined;

  // Mini sparkline from all bound tag values (simplified - shows current as single point)
  const allBindings = Object.entries(bindings);

  return (
    <BaseFaceplate title={element.properties?.label || 'Meter'} type="Meter" x={x} y={y} onClose={onClose} onPin={onPin} pinned={pinned}>
      {/* Large digital display */}
      <div className="flex items-center justify-center mb-3 py-3 bg-gray-800 rounded-lg border border-gray-700">
        <span className="text-3xl font-mono font-bold text-green-400">
          {primaryValue !== undefined ? (typeof primaryValue === 'number' ? primaryValue.toFixed(2) : String(primaryValue)) : '---'}
        </span>
        {element.properties?.unit && (
          <span className="text-sm text-gray-400 ml-2">{element.properties.unit}</span>
        )}
      </div>

      {/* Tag */}
      {tag && <div className="text-[10px] text-gray-500 mb-2 font-mono">{tag}</div>}

      {/* Secondary values */}
      {allBindings.length > 0 && (
        <div className="space-y-1 mb-3 border-t border-gray-700 pt-2">
          {allBindings.map(([key, tagName]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-white font-mono">{values[tagName as string] !== undefined ? String(values[tagName as string]) : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </BaseFaceplate>
  );
}
