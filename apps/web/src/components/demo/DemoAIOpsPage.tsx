import { useState, useEffect } from 'react';
import { useSimulationContext } from './DemoSimulationContext';
import { 
  Brain, TrendingUp, AlertTriangle, Lightbulb, Zap, Search,
  Activity, Clock, CheckCircle, XCircle, MessageSquare, Send
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PredictiveAlert {
  id: string;
  equipment: string;
  message: string;
  confidence: number;
  severity: 'High' | 'Medium' | 'Low';
  timeHorizon: string;
  recommendation: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface EquipmentHealth {
  equipment: string;
  health: number;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  issues: string[];
}

interface AIInsight {
  id: string;
  type: 'Efficiency' | 'Maintenance' | 'Operations' | 'Safety';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  actionRequired: boolean;
}

const PREDICTIVE_ALERTS: PredictiveAlert[] = [
  {
    id: '1',
    equipment: 'Transformer TR1',
    message: 'Oil temperature trending 12% above baseline',
    confidence: 87,
    severity: 'Medium',
    timeHorizon: '3-5 days',
    recommendation: 'Schedule cooling system inspection',
    trend: 'increasing'
  },
  {
    id: '2',
    equipment: 'Feeder 02',
    message: 'Load pattern indicates potential overload condition',
    confidence: 92,
    severity: 'High',
    timeHorizon: '1-2 days',
    recommendation: 'Consider load redistribution or schedule maintenance',
    trend: 'increasing'
  },
  {
    id: '3',
    equipment: 'Protection Relay P543-TR2',
    message: 'Communication latency increasing gradually',
    confidence: 74,
    severity: 'Low',
    timeHorizon: '1-2 weeks',
    recommendation: 'Monitor communication statistics and check network',
    trend: 'increasing'
  }
];

const EQUIPMENT_HEALTH: EquipmentHealth[] = [
  {
    equipment: 'Transformer TR1',
    health: 92,
    status: 'Excellent',
    issues: []
  },
  {
    equipment: 'Transformer TR2',
    health: 85,
    status: 'Good',
    issues: ['Oil temperature slightly elevated']
  },
  {
    equipment: 'Protection Relay RTU-002',
    health: 98,
    status: 'Excellent',
    issues: []
  },
  {
    equipment: 'Protection Relay RTU-003',
    health: 89,
    status: 'Good',
    issues: ['Occasional communication delays']
  },
  {
    equipment: 'Energy Meter METER-002',
    health: 76,
    status: 'Fair',
    issues: ['Calibration drift detected', 'Response time increased']
  },
  {
    equipment: 'BCU-001',
    health: 94,
    status: 'Excellent',
    issues: []
  }
];

const AI_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    type: 'Efficiency',
    title: 'Optimal Load Distribution Opportunity',
    description: 'Current loading pattern shows TR1 at 68% while TR2 at 45%. Redistributing 8% load could improve efficiency by 3.2%.',
    impact: 'Medium',
    actionRequired: true
  },
  {
    id: '2',
    type: 'Maintenance',
    title: 'Preventive Maintenance Window',
    description: 'Low load period detected between 2:00-5:00 AM for the next 3 days. Optimal time for scheduled maintenance activities.',
    impact: 'High',
    actionRequired: false
  },
  {
    id: '3',
    type: 'Operations',
    title: 'Peak Load Forecast Alert',
    description: 'Weather forecast indicates 15% higher cooling load expected tomorrow between 2:00-6:00 PM. Current capacity sufficient.',
    impact: 'Medium',
    actionRequired: false
  },
  {
    id: '4',
    type: 'Safety',
    title: 'Emergency Response Readiness',
    description: 'All protection systems operational. Emergency diesel generator last tested 15 days ago - next test due in 15 days.',
    impact: 'Low',
    actionRequired: false
  }
];

// Mock forecast data
const generateForecastData = () => {
  const now = new Date();
  const data = [];
  
  for (let i = 0; i < 24; i++) {
    const hour = new Date(now.getTime() + i * 3600000);
    const baseLoad = 6.5 + Math.sin(i * Math.PI / 12) * 2.5;
    const actual = i < 2 ? baseLoad + (Math.random() - 0.5) * 0.5 : null;
    const forecast = baseLoad + Math.sin(i * Math.PI / 8) * 0.8 + (Math.random() - 0.5) * 0.3;
    
    data.push({
      hour: hour.getHours(),
      actual,
      forecast,
      confidence: 95 - Math.abs(i - 12) * 2 // Confidence decreases with time
    });
  }
  
  return data;
};

const ANOMALY_DATA = [
  {
    timestamp: '14:23',
    equipment: 'Feeder 03',
    anomaly: 'Current spike - 15% above normal',
    severity: 'Medium',
    aiAnalysis: 'Pattern suggests equipment startup. Normal for this feeder.',
    action: 'Monitor'
  },
  {
    timestamp: '13:45',
    equipment: 'TR1 Oil Temp',
    anomaly: 'Temperature rise rate increased',
    severity: 'Low',
    aiAnalysis: 'Ambient temperature correlation detected. Within normal variance.',
    action: 'Continue monitoring'
  },
  {
    timestamp: '12:15',
    equipment: 'System Frequency',
    anomaly: 'Micro-oscillations detected',
    severity: 'Low',
    aiAnalysis: 'Grid disturbance. Frequency returned to normal within 30 seconds.',
    action: 'No action required'
  }
];

export default function DemoAIOpsPage() {
  const { measurements } = useSimulationContext();
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [nlQuery, setNlQuery] = useState('');
  const [nlResponse, setNlResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [forecastData] = useState(generateForecastData());

  const handleNLQuery = async () => {
    if (!nlQuery.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      let response = '';
      
      const query = nlQuery.toLowerCase();
      if (query.includes('peak load') || query.includes('maximum load')) {
        response = 'Yesterday\'s peak load was 10.2 MW at 18:30. Today\'s forecast peak is 9.8 MW expected at 18:15. The system is operating well within capacity limits.';
      } else if (query.includes('transformer') && query.includes('temperature')) {
        response = 'TR1 oil temperature is currently 68°C, which is normal. TR2 is at 71°C, slightly elevated but within acceptable range. Both transformers are operating safely.';
      } else if (query.includes('efficiency') || query.includes('optimize')) {
        response = 'Current system efficiency is 94.2%. To optimize: redistribute 8% load from TR1 to TR2, and consider scheduling maintenance during the low-load period (2-5 AM).';
      } else if (query.includes('alarm') || query.includes('issue')) {
        response = 'Currently 3 active alarms: 2 low-priority information alerts and 1 medium-priority warning for Feeder 02 loading. No critical issues detected.';
      } else if (query.includes('forecast') || query.includes('tomorrow')) {
        response = 'Tomorrow\'s load forecast: Peak 10.1 MW at 18:30 (+3% vs today), minimum 3.8 MW at 04:00. Weather factor: +15% cooling load expected due to higher temperatures.';
      } else {
        response = 'I can help analyze system performance, equipment health, load forecasts, and operational efficiency. Try asking about peak loads, transformer temperatures, system efficiency, or tomorrow\'s forecast.';
      }
      
      setNlResponse(response);
      setIsProcessing(false);
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600 bg-green-500';
    if (health >= 75) return 'text-yellow-600 bg-yellow-500';
    return 'text-red-600 bg-red-500';
  };

  const getHealthStatus = (health: number) => {
    if (health >= 90) return 'Excellent';
    if (health >= 80) return 'Good';
    if (health >= 70) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-blue-600" />
            AI Operations Center
          </h2>
          <p className="text-gray-600 mt-1">Intelligent insights and predictive analytics</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          AI Engine Active
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">{PREDICTIVE_ALERTS.length}</div>
              <div className="text-sm text-blue-700">Predictive Alerts</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">94.2%</div>
              <div className="text-sm text-green-700">System Efficiency</div>
            </div>
            <Zap className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-900">{AI_INSIGHTS.filter(i => i.actionRequired).length}</div>
              <div className="text-sm text-purple-700">Action Required</div>
            </div>
            <Lightbulb className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-900">89%</div>
              <div className="text-sm text-orange-700">Avg Equipment Health</div>
            </div>
            <Activity className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Load Forecast */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              24-Hour Load Forecast
            </h3>
            <p className="text-sm text-gray-600 mt-1">AI-powered load prediction with confidence intervals</p>
          </div>
          <div className="p-6">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                  <YAxis label={{ value: 'Load (MW)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    labelFormatter={(hour) => `Time: ${hour}:00`}
                    formatter={(value: any, name: string) => [
                      `${Number(value).toFixed(1)} MW`, 
                      name === 'actual' ? 'Actual' : 'Forecast'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.1}
                    name="forecast"
                  />
                  {forecastData.some(d => d.actual !== null) && (
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', r: 4 }}
                      name="actual"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-800">
                <strong>AI Analysis:</strong> Peak load expected at 18:15 (9.8 MW). Weather forecast indicates 15% increase in cooling demand tomorrow afternoon.
              </div>
            </div>
          </div>
        </div>

        {/* Natural Language Query */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Ask the AI
            </h3>
            <p className="text-sm text-gray-600 mt-1">Natural language queries</p>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="What was peak load yesterday?"
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNLQuery()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleNLQuery}
                  disabled={isProcessing || !nlQuery.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {nlResponse && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-sm text-green-800">{nlResponse}</div>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                Try asking about: peak loads, equipment temperatures, efficiency optimization, forecasts, or system issues.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Predictive Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Predictive Maintenance
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {PREDICTIVE_ALERTS.map(alert => (
                <div key={alert.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-sm">{alert.equipment}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Confidence: {alert.confidence}%</div>
                    <div>Time horizon: {alert.timeHorizon}</div>
                    <div className="text-blue-600 font-medium">{alert.recommendation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment Health */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Equipment Health
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {EQUIPMENT_HEALTH.map((equipment, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{equipment.equipment}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{equipment.health}%</span>
                      <div className={`w-3 h-3 rounded-full ${getHealthColor(equipment.health)}`} />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${getHealthColor(equipment.health).split(' ')[2]}`}
                      style={{ width: `${equipment.health}%` }}
                    />
                  </div>
                  {equipment.issues.length > 0 && (
                    <div className="text-xs text-gray-600">
                      Issues: {equipment.issues.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              AI Insights
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {AI_INSIGHTS.map(insight => (
                <div 
                  key={insight.id} 
                  onClick={() => setSelectedInsight(insight)}
                  className="border border-gray-100 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-sm">{insight.title}</div>
                    <div className="flex items-center gap-1">
                      {insight.actionRequired && (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(insight.impact)}`}>
                        {insight.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{insight.description}</p>
                  <div className="mt-2 text-xs text-purple-600 font-medium">{insight.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-red-600" />
            Real-time Anomaly Detection
          </h3>
          <p className="text-sm text-gray-600 mt-1">AI-powered pattern recognition and anomaly alerts</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anomaly Detected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Analysis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ANOMALY_DATA.map((anomaly, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm font-mono">{anomaly.timestamp}</td>
                  <td className="px-6 py-4 text-sm font-medium">{anomaly.equipment}</td>
                  <td className="px-6 py-4 text-sm">{anomaly.anomaly}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{anomaly.aiAnalysis}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium">{anomaly.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-lg">{selectedInsight.title}</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-700">Type</div>
                <div className="text-sm">{selectedInsight.type}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Impact</div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(selectedInsight.impact)}`}>
                  {selectedInsight.impact}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Description</div>
                <div className="text-sm text-gray-600">{selectedInsight.description}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">Action Required</div>
                <div className={`flex items-center gap-1 text-sm ${selectedInsight.actionRequired ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedInsight.actionRequired ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  {selectedInsight.actionRequired ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedInsight(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
              {selectedInsight.actionRequired && (
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Take Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}