import { useSimulationContext } from './DemoSimulationContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, Activity, TrendingUp } from 'lucide-react';

// Gauge component since recharts doesn't have one
function CircularGauge({ value, max, label, unit, color }: {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="bg-white rounded-lg p-6 border">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{value.toFixed(0)}</div>
              <div className="text-xs text-gray-500">{unit}</div>
            </div>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(0)}% of {max}{unit}</p>
      </div>
    </div>
  );
}

const COLORS = ['#DC2626', '#16A34A', '#7C3AED', '#EA580C', '#0EA5E9', '#F59E0B'];

export default function DemoAnalyticsPage() {
  const { measurements, cbStates, energizationState } = useSimulationContext();

  // Prepare feeder load data for bar chart
  const feederLoadData = [];
  for (let i = 1; i <= 6; i++) {
    const fdrNum = String(i).padStart(2, '0');
    const power = measurements[`FDR${fdrNum}_P`] || 0;
    const current = measurements[`FDR${fdrNum}_I`] || 0;
    const isEnergized = energizationState.feeders[`FDR${fdrNum}_CB`] || false;
    
    feederLoadData.push({
      name: `FDR ${i}`,
      power: isEnergized ? power : 0,
      current: isEnergized ? current : 0,
    });
  }

  // Feeder current distribution for pie chart
  const currentDistribution = feederLoadData
    .filter(f => f.current > 0)
    .map((f, i) => ({
      name: f.name,
      value: f.current,
      color: COLORS[i % COLORS.length],
    }));

  // Calculate power factor (demo calculation)
  const totalActivePower = (measurements.TR1_P || 0) + (measurements.TR2_P || 0);
  const totalApparentPower = totalActivePower * 1.15; // Simulated
  const powerFactor = totalApparentPower > 0 ? totalActivePower / totalApparentPower : 0;

  // Transformer loading
  const tr1Loading = ((measurements.TR1_P || 0) / 8.0) * 100; // 8 MVA transformers
  const tr2Loading = ((measurements.TR2_P || 0) / 8.0) * 100;

  // Bus voltage data
  const busVoltageData = [
    { 
      name: '33kV Bus 1', 
      voltage: energizationState['33kV_Bus_Section_1'] ? measurements.INC1_V || 0 : 0,
      nominal: 33,
    },
    { 
      name: '33kV Bus 2', 
      voltage: energizationState['33kV_Bus_Section_2'] ? measurements.INC1_V || 0 : 0,
      nominal: 33,
    },
    { 
      name: '11kV Bus 1', 
      voltage: energizationState['11kV_Bus_Section_1'] ? measurements.BUS_11KV_V || 0 : 0,
      nominal: 11,
    },
    { 
      name: '11kV Bus 2', 
      voltage: energizationState['11kV_Bus_Section_2'] ? measurements.BUS_11KV_V || 0 : 0,
      nominal: 11,
    },
  ];

  const totalSubstationLoad = feederLoadData.reduce((sum, f) => sum + f.power, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Load Flow & Analytics</h2>
        <p className="text-gray-600 mt-1">Real-time substation analytics and performance metrics</p>
      </div>

      {/* Key metrics cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8" />
            <div>
              <div className="text-2xl font-bold">{totalSubstationLoad.toFixed(1)}</div>
              <div className="text-blue-100 text-sm">Total Load (MW)</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8" />
            <div>
              <div className="text-2xl font-bold">{powerFactor.toFixed(2)}</div>
              <div className="text-green-100 text-sm">Power Factor</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <div className="text-2xl font-bold">{measurements.BUS_11KV_V?.toFixed(1) || '0.0'}</div>
              <div className="text-purple-100 text-sm">Bus Voltage (kV)</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl text-orange-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg></div>
            <div>
              <div className="text-2xl font-bold">{Math.max(measurements.TR1_OIL_TEMP || 0, measurements.TR2_OIL_TEMP || 0).toFixed(0)}</div>
              <div className="text-orange-100 text-sm">Max Oil Temp (°C)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feeder Load Bar Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feeder Load Distribution</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feederLoadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`${Number(value).toFixed(2)} MW`, 'Power']} />
                <Bar dataKey="power" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Distribution Pie Chart */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feeder Current Distribution</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {currentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)} A`, 'Current']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {currentDistribution.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">No energized feeders</p>
            </div>
          )}
        </div>

        {/* Transformer Loading Gauges */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transformer Loading</h3>
          <div className="grid grid-cols-2 gap-4">
            <CircularGauge 
              value={tr1Loading} 
              max={100} 
              label="TR-1 Loading" 
              unit="%" 
              color="#16A34A"
            />
            <CircularGauge 
              value={tr2Loading} 
              max={100} 
              label="TR-2 Loading" 
              unit="%" 
              color="#7C3AED"
            />
          </div>
        </div>

        {/* Bus Voltage Profile */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bus Voltage Profile</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={busVoltageData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)} kV`, 'Voltage']} />
                <Bar dataKey="voltage" fill="#DC2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Information panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg></div>
          <div>
            <h4 className="font-medium text-blue-900">Analytics Information</h4>
            <p className="text-blue-700 text-sm mt-1">
              • All metrics update in real-time based on simulated measurements
              <br />
              • Transformer loading is calculated as percentage of 8 MVA rating
              <br />
              • Power factor is derived from active and apparent power calculations
              <br />
              • Bus voltage shows actual values only when energized (gray when de-energized)
              <br />
              • Charts automatically adjust when circuit breakers open/close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}