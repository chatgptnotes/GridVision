import { useState, useEffect } from 'react';
import { useSimulationContext } from './DemoSimulationContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

interface TrendData {
  timestamp: string;
  value: number;
}

interface TrendHistory {
  [key: string]: TrendData[];
}

const TREND_CONFIGS = [
  { key: 'INC1_V', label: 'Incomer Voltage', unit: 'kV', color: '#DC2626' },
  { key: 'INC1_I', label: 'Incomer Current', unit: 'A', color: '#16A34A' },
  { key: 'TR1_P', label: 'TR1 Power', unit: 'MW', color: '#7C3AED' },
  { key: 'TR1_OIL_TEMP', label: 'TR1 Oil Temperature', unit: '°C', color: '#EA580C' },
];

export default function DemoTrendsPage() {
  const { measurements } = useSimulationContext();
  const [trendHistory, setTrendHistory] = useState<TrendHistory>({});
  const [selectedTrends, setSelectedTrends] = useState<string[]>(TREND_CONFIGS.map(c => c.key));

  // Build trend history
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    
    setTrendHistory(prev => {
      const updated = { ...prev };
      
      TREND_CONFIGS.forEach(config => {
        const value = measurements[config.key] || 0;
        const point = { timestamp, value };
        
        if (!updated[config.key]) {
          updated[config.key] = [];
        }
        
        // Keep only last 30 points (60 seconds of data at 2s intervals)
        updated[config.key] = [...updated[config.key], point].slice(-30);
      });
      
      return updated;
    });
  }, [measurements]);

  const toggleTrend = (key: string) => {
    setSelectedTrends(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-time Trends</h2>
          <p className="text-gray-600 mt-1">Live measurement trending with 60-second history</p>
        </div>
        
        {/* Trend selector */}
        <div className="relative">
          <select 
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const value = e.target.value;
              if (value && !selectedTrends.includes(value)) {
                setSelectedTrends([...selectedTrends, value]);
              }
            }}
            value=""
          >
            <option value="">Add Trend...</option>
            {TREND_CONFIGS.filter(c => !selectedTrends.includes(c.key)).map(config => (
              <option key={config.key} value={config.key}>{config.label}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Trend panels in 2x2 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedTrends.slice(0, 4).map((trendKey) => {
          const config = TREND_CONFIGS.find(c => c.key === trendKey);
          if (!config) return null;
          
          const data = trendHistory[trendKey] || [];
          const currentValue = measurements[trendKey] || 0;
          
          return (
            <div key={trendKey} className="bg-gray-900 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{config.label}</h3>
                  <div className="text-2xl font-mono" style={{ color: config.color }}>
                    {currentValue.toFixed(1)} {config.unit}
                  </div>
                </div>
                <button
                  onClick={() => toggleTrend(trendKey)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>
              
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <Tooltip 
                      labelStyle={{ color: '#111827' }}
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: 'none', 
                        borderRadius: '6px',
                        color: '#F3F4F6'
                      }}
                      formatter={(value: any) => [`${Number(value).toFixed(2)} ${config.unit}`, config.label]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={config.color} 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: config.color }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Additional info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5">ℹ️</div>
          <div>
            <h4 className="font-medium text-blue-900">Trend Information</h4>
            <p className="text-blue-700 text-sm mt-1">
              • Data updates every 2 seconds matching the simulation cycle
              <br />
              • History shows the last 60 seconds of measurements  
              <br />
              • Click the ✕ to remove trends, use the dropdown to add them back
              <br />
              • Values are simulated and represent typical substation readings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}