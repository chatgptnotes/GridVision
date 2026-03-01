import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import TrendViewer from '@/components/trends/TrendViewer';
import TrendSelector from '@/components/trends/TrendSelector';
import type { TrendData } from '@gridvision/shared';

const TIME_RANGES = [
  { label: '1H', hours: 1 },
  { label: '6H', hours: 6 },
  { label: '24H', hours: 24 },
  { label: '7D', hours: 168 },
  { label: '30D', hours: 720 },
];

export default function Trends() {
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState(24);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPointIds.length === 0) return;
    fetchTrend();
  }, [selectedPointIds, timeRange]);

  const fetchTrend = async () => {
    setLoading(true);
    try {
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - timeRange * 60 * 60 * 1000).toISOString();
      const { data } = await api.get<TrendData[]>('/trends/data', {
        params: {
          dataPointIds: selectedPointIds.join(','),
          startTime,
          endTime,
        },
      });
      setTrendData(data);
    } catch (error) {
      console.error('Failed to fetch trend data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Historical Trends</h2>
        <div className="flex items-center gap-2">
          {TIME_RANGES.map((tr) => (
            <button
              key={tr.label}
              onClick={() => setTimeRange(tr.hours)}
              className={`px-3 py-1 text-sm rounded ${timeRange === tr.hours ? 'bg-scada-accent text-white' : 'bg-scada-panel text-gray-400 border border-scada-border'}`}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-1 overflow-hidden">
        {/* Point Selector */}
        <div className="w-72 shrink-0">
          <TrendSelector
            selectedIds={selectedPointIds}
            onChange={setSelectedPointIds}
            maxSelection={8}
          />
        </div>

        {/* Chart */}
        <div className="flex-1 bg-scada-panel border border-scada-border rounded-lg p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500">Loading trend data...</div>
          ) : trendData.length > 0 ? (
            <TrendViewer data={trendData} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select data points to view trends
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
