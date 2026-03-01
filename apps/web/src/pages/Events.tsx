import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { format } from 'date-fns';

interface SOEEvent {
  time: string;
  tag: string;
  dp_name: string;
  equip_name: string;
  old_state: string;
  new_state: string;
  cause: string | null;
}

export default function Events() {
  const [events, setEvents] = useState<SOEEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(24);

  useEffect(() => {
    fetchEvents();
  }, [timeRange]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - timeRange * 60 * 60 * 1000).toISOString();
      const { data } = await api.get('/trends/soe', { params: { startTime, endTime } });
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch SOE events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sequence of Events (SOE)</h2>
        <div className="flex items-center gap-2">
          {[1, 6, 24, 168].map((h) => (
            <button
              key={h}
              onClick={() => setTimeRange(h)}
              className={`px-3 py-1 text-sm rounded ${timeRange === h ? 'bg-scada-accent text-white' : 'bg-scada-panel text-gray-400 border border-scada-border'}`}
            >
              {h < 24 ? `${h}H` : `${h / 24}D`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-scada-panel border border-scada-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-scada-panel border-b border-scada-border">
            <tr className="text-left text-gray-400">
              <th className="px-4 py-2 w-48">Timestamp</th>
              <th className="px-4 py-2">Tag</th>
              <th className="px-4 py-2">Equipment</th>
              <th className="px-4 py-2 w-28">Old State</th>
              <th className="px-4 py-2 w-28">New State</th>
              <th className="px-4 py-2">Cause</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No events in selected period</td></tr>
            ) : (
              events.map((event, i) => (
                <tr key={i} className="border-b border-scada-border/30 hover:bg-scada-border/20">
                  <td className="px-4 py-2 font-mono text-xs">
                    {format(new Date(event.time), 'dd-MMM-yyyy HH:mm:ss.SSS')}
                  </td>
                  <td className="px-4 py-2 font-mono text-scada-accent">{event.tag}</td>
                  <td className="px-4 py-2">{event.equip_name}</td>
                  <td className="px-4 py-2">
                    <StateChip state={event.old_state} />
                  </td>
                  <td className="px-4 py-2">
                    <StateChip state={event.new_state} />
                  </td>
                  <td className="px-4 py-2 text-gray-400">{event.cause || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StateChip({ state }: { state: string }) {
  const color = state === 'CLOSED' ? 'text-red-400 bg-red-900/30' : 'text-green-400 bg-green-900/30';
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium ${color}`}>
      {state}
    </span>
  );
}
