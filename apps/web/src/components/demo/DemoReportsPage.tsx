import { useState } from 'react';
import { useSimulationContext } from './DemoSimulationContext';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  FileText, Download, Calendar, Clock, TrendingUp, 
  Zap, AlertTriangle, Activity, Play, Printer
} from 'lucide-react';

const REPORT_TEMPLATES = [
  {
    id: 'daily-load',
    title: 'Daily Load Profile',
    description: 'Hourly load demand analysis for the past 24 hours',
    category: 'Operations',
    icon: TrendingUp
  },
  {
    id: 'energy-summary',
    title: 'Monthly Energy Summary',
    description: 'Energy consumption and generation summary for current month',
    category: 'Billing',
    icon: Zap
  },
  {
    id: 'fault-analysis',
    title: 'Fault Analysis Report',
    description: 'Analysis of faults, trips, and protection operations',
    category: 'Maintenance',
    icon: AlertTriangle
  },
  {
    id: 'equipment-utilization',
    title: 'Equipment Utilization',
    description: 'Transformer loading and feeder utilization statistics',
    category: 'Operations',
    icon: Activity
  }
];

const SCHEDULED_REPORTS = [
  {
    id: '1',
    template: 'Daily Load Profile',
    schedule: 'Daily at 06:00',
    lastRun: '2024-03-03 06:00',
    nextRun: '2024-03-04 06:00',
    recipients: ['operations@power.com', 'manager@power.com'],
    status: 'Active'
  },
  {
    id: '2',
    template: 'Monthly Energy Summary',
    schedule: 'Monthly on 1st',
    lastRun: '2024-03-01 08:00',
    nextRun: '2024-04-01 08:00',
    recipients: ['billing@power.com'],
    status: 'Active'
  },
  {
    id: '3',
    template: 'Fault Analysis Report',
    schedule: 'Weekly on Monday',
    lastRun: '2024-03-01 09:00',
    nextRun: '2024-03-08 09:00',
    recipients: ['maintenance@power.com'],
    status: 'Paused'
  }
];

// Mock data
const loadProfileData = [
  { hour: '00:00', load: 4.2 }, { hour: '01:00', load: 3.8 },
  { hour: '02:00', load: 3.5 }, { hour: '03:00', load: 3.3 },
  { hour: '04:00', load: 3.1 }, { hour: '05:00', load: 3.4 },
  { hour: '06:00', load: 4.8 }, { hour: '07:00', load: 6.2 },
  { hour: '08:00', load: 7.5 }, { hour: '09:00', load: 8.1 },
  { hour: '10:00', load: 8.4 }, { hour: '11:00', load: 8.7 },
  { hour: '12:00', load: 9.1 }, { hour: '13:00', load: 8.9 },
  { hour: '14:00', load: 8.6 }, { hour: '15:00', load: 8.8 },
  { hour: '16:00', load: 9.3 }, { hour: '17:00', load: 9.8 },
  { hour: '18:00', load: 10.2 }, { hour: '19:00', load: 9.5 },
  { hour: '20:00', load: 8.1 }, { hour: '21:00', load: 6.9 },
  { hour: '22:00', load: 5.8 }, { hour: '23:00', load: 4.9 }
];

const energyData = [
  { category: 'Feeder 1', energy: 245, percentage: 22.3 },
  { category: 'Feeder 2', energy: 198, percentage: 18.0 },
  { category: 'Feeder 3', energy: 167, percentage: 15.2 },
  { category: 'Feeder 4', energy: 156, percentage: 14.2 },
  { category: 'Feeder 5', energy: 178, percentage: 16.2 },
  { category: 'Feeder 6', energy: 156, percentage: 14.1 }
];

const COLORS = ['#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function DemoReportsPage() {
  const { measurements } = useSimulationContext();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('daily-load');
  const [showScheduled, setShowScheduled] = useState(false);

  const selectedReport = REPORT_TEMPLATES.find(t => t.id === selectedTemplate);

  const renderReport = () => {
    switch (selectedTemplate) {
      case 'daily-load':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">10.2 MW</div>
                <div className="text-sm text-blue-700">Peak Load</div>
                <div className="text-xs text-blue-600 mt-1">at 18:00 hrs</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">3.1 MW</div>
                <div className="text-sm text-green-700">Minimum Load</div>
                <div className="text-xs text-green-600 mt-1">at 04:00 hrs</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-900">6.8 MW</div>
                <div className="text-sm text-purple-700">Average Load</div>
                <div className="text-xs text-purple-600 mt-1">24-hour period</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4">Hourly Load Profile</h4>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={loadProfileData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis label={{ value: 'Load (MW)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: any) => [`${value} MW`, 'Load']} />
                    <Line type="monotone" dataKey="load" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'energy-summary':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">4,875</div>
                <div className="text-sm text-blue-700">Total MWh</div>
                <div className="text-xs text-blue-600 mt-1">This Month</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">96.2%</div>
                <div className="text-sm text-green-700">Availability</div>
                <div className="text-xs text-green-600 mt-1">System Uptime</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-900">0.85</div>
                <div className="text-sm text-yellow-700">Power Factor</div>
                <div className="text-xs text-yellow-600 mt-1">Average</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-900">2.4%</div>
                <div className="text-sm text-red-700">T&D Losses</div>
                <div className="text-xs text-red-600 mt-1">Distribution</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4">Energy Distribution by Feeder</h4>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={energyData}
                        dataKey="energy"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                      >
                        {energyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value} MWh`, 'Energy']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4">Feeder Energy Consumption</h4>
                <div className="space-y-3">
                  {energyData.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{item.energy} MWh</div>
                        <div className="text-xs text-gray-600">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'fault-analysis':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-900">7</div>
                <div className="text-sm text-red-700">Total Faults</div>
                <div className="text-xs text-red-600 mt-1">This Month</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-900">24.5 min</div>
                <div className="text-sm text-yellow-700">Avg Restoration</div>
                <div className="text-xs text-yellow-600 mt-1">Time per fault</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">99.1%</div>
                <div className="text-sm text-green-700">System Reliability</div>
                <div className="text-xs text-green-600 mt-1">SAIDI Index</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-semibold">Recent Fault Events</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fault Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm">2024-03-02 14:35</td>
                      <td className="px-4 py-3 text-sm font-medium">Feeder 03 CB</td>
                      <td className="px-4 py-3 text-sm">Overcurrent (Phase A)</td>
                      <td className="px-4 py-3 text-sm">18 minutes</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Restored
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">2024-03-01 09:22</td>
                      <td className="px-4 py-3 text-sm font-medium">Feeder 05 CB</td>
                      <td className="px-4 py-3 text-sm">Earth Fault</td>
                      <td className="px-4 py-3 text-sm">42 minutes</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Restored
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">2024-02-28 16:18</td>
                      <td className="px-4 py-3 text-sm font-medium">TR1 Protection</td>
                      <td className="px-4 py-3 text-sm">Differential</td>
                      <td className="px-4 py-3 text-sm">8 minutes</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          False Trip
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'equipment-utilization':
        const utilizationData = [
          { equipment: 'TR1 (10 MVA)', loading: 68, status: 'Normal' },
          { equipment: 'TR2 (10 MVA)', loading: 45, status: 'Normal' },
          { equipment: 'Feeder 01', loading: 78, status: 'Normal' },
          { equipment: 'Feeder 02', loading: 92, status: 'High' },
          { equipment: 'Feeder 03', loading: 34, status: 'Low' },
          { equipment: 'Feeder 04', loading: 67, status: 'Normal' },
          { equipment: 'Feeder 05', loading: 81, status: 'Normal' },
          { equipment: 'Feeder 06', loading: 56, status: 'Normal' },
        ];

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">63.4%</div>
                <div className="text-sm text-blue-700">Avg Transformer Loading</div>
                <div className="text-xs text-blue-600 mt-1">TR1 & TR2 Combined</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-900">68.2%</div>
                <div className="text-sm text-green-700">Avg Feeder Utilization</div>
                <div className="text-xs text-green-600 mt-1">All Feeders</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-900">15.6 MVA</div>
                <div className="text-sm text-purple-700">Available Capacity</div>
                <div className="text-xs text-purple-600 mt-1">Total System</div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4">Equipment Loading Analysis</h4>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilizationData} margin={{ left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="equipment" angle={-45} textAnchor="end" height={80} />
                    <YAxis label={{ value: 'Loading (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Loading']} />
                    <Bar dataKey="loading" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-semibold">Utilization Summary</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Loading</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {utilizationData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm font-medium">{item.equipment}</td>
                        <td className="px-4 py-3 text-sm">{item.loading}%</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'High' 
                              ? 'bg-red-100 text-red-800'
                              : item.status === 'Low'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.loading > 85 ? 'Monitor closely' : 
                           item.loading < 40 ? 'Consider load balancing' : 
                           'Operating normally'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a report template</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Pre-built reports and custom analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScheduled(!showScheduled)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showScheduled 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Scheduled
          </button>
        </div>
      </div>

      {!showScheduled ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report Templates */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Report Templates</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {REPORT_TEMPLATES.map(template => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === template.id;
                  
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mt-0.5 ${
                        isSelected ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div className="min-w-0">
                        <div className="font-medium text-sm">{template.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                        <div className="text-xs text-blue-600 mt-1">{template.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="lg:col-span-3">
            {selectedReport && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <selectedReport.icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{selectedReport.title}</h3>
                      <p className="text-sm text-gray-600">{selectedReport.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Export PDF
                    </button>
                    <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {renderReport()}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Scheduled Reports */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-900">Scheduled Reports</h3>
            <p className="text-sm text-gray-600 mt-1">Automated report generation and distribution</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Run</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Run</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {SCHEDULED_REPORTS.map(report => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.template}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.schedule}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.lastRun}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.nextRun}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        {report.recipients.map((email, index) => (
                          <div key={index} className="text-xs">{email}</div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        report.status === 'Active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        <Play className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}