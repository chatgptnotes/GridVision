import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Search } from 'lucide-react';

interface DataPoint {
  id: string;
  tag: string;
  name: string;
  paramType: string;
  unit: string | null;
  equipment: { tag: string; name: string; type: string };
}

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxSelection: number;
}

export default function TrendSelector({ selectedIds, onChange, maxSelection }: Props) {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/data-points')
      .then(({ data }) => setDataPoints(data.filter((dp: DataPoint) => dp.paramType === 'ANALOG')))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? dataPoints.filter((dp) =>
        dp.tag.toLowerCase().includes(search.toLowerCase()) ||
        dp.name.toLowerCase().includes(search.toLowerCase()),
      )
    : dataPoints;

  const togglePoint = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else if (selectedIds.length < maxSelection) {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg h-full flex flex-col">
      <div className="p-3 border-b border-scada-border">
        <div className="text-sm font-medium mb-2">
          Data Points ({selectedIds.length}/{maxSelection})
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags..."
            className="w-full pl-8 pr-3 py-1.5 bg-scada-bg border border-scada-border rounded text-sm"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-0.5">
        {loading ? (
          <div className="text-center py-4 text-gray-500 text-sm">Loading...</div>
        ) : (
          filtered.map((dp) => (
            <button
              key={dp.id}
              onClick={() => togglePoint(dp.id)}
              className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                selectedIds.includes(dp.id) ? 'bg-scada-accent/20 text-scada-accent' : 'hover:bg-scada-border/30 text-gray-400'
              }`}
            >
              <div className="font-mono truncate">{dp.tag}</div>
              <div className="text-[10px] text-gray-500 truncate">{dp.name} {dp.unit && `(${dp.unit})`}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
