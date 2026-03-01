import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { TrendData } from '@gridvision/shared';

const COLORS = ['#3B82F6', '#16A34A', '#DC2626', '#EAB308', '#F97316', '#8B5CF6', '#EC4899', '#06B6D4'];

interface Props {
  data: TrendData[];
}

export default function TrendViewer({ data }: Props) {
  // Merge all trend data into a unified timeline
  const timeMap = new Map<string, Record<string, number>>();

  data.forEach((series, index) => {
    series.points.forEach((point) => {
      const timeKey = new Date(point.time).toISOString();
      if (!timeMap.has(timeKey)) {
        timeMap.set(timeKey, { time: new Date(point.time).getTime() });
      }
      timeMap.get(timeKey)![`series_${index}`] = point.avg;
    });
  });

  const chartData = Array.from(timeMap.values()).sort((a, b) => a.time - b.time);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="time"
          tickFormatter={(t) => format(new Date(t), 'HH:mm')}
          stroke="#64748B"
          fontSize={10}
        />
        <YAxis stroke="#64748B" fontSize={10} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
          labelFormatter={(t) => format(new Date(t), 'dd-MMM-yyyy HH:mm:ss')}
          formatter={(value: number, name: string) => {
            const index = parseInt(name.split('_')[1]);
            return [value.toFixed(3), `${data[index]?.tag || name} (${data[index]?.unit || ''})`];
          }}
        />
        <Legend
          formatter={(_value, entry) => {
            const index = parseInt((entry.dataKey as string).split('_')[1]);
            return `${data[index]?.tag || ''} (${data[index]?.unit || ''})`;
          }}
        />
        {data.map((_, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={`series_${index}`}
            stroke={COLORS[index % COLORS.length]}
            dot={false}
            strokeWidth={1.5}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
