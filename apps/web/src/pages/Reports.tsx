import { useState } from 'react';
import { api } from '@/services/api';
import { FileText, Download } from 'lucide-react';

type ReportType = 'daily-load' | 'alarm-summary';

export default function Reports() {
  const [reportType, setReportType] = useState<ReportType>('daily-load');
  const [reportData, setReportData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const generateReport = async () => {
    setLoading(true);
    try {
      if (reportType === 'daily-load') {
        const { data } = await api.get('/reports/daily-load', {
          params: { substationId: 'all', date },
        });
        setReportData(data);
      } else {
        const startTime = new Date(date);
        startTime.setHours(0, 0, 0, 0);
        const endTime = new Date(date);
        endTime.setHours(23, 59, 59, 999);
        const { data } = await api.get('/reports/alarm-summary', {
          params: { startTime: startTime.toISOString(), endTime: endTime.toISOString() },
        });
        setReportData(data);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-3">
      <h2 className="text-xl font-semibold">Reports</h2>

      {/* Report Selection */}
      <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="bg-scada-bg border border-scada-border rounded px-3 py-1.5 text-sm"
            >
              <option value="daily-load">Daily Load Report</option>
              <option value="alarm-summary">Alarm Summary Report</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-scada-bg border border-scada-border rounded px-3 py-1.5 text-sm"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={generateReport}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-scada-accent hover:bg-blue-600 text-white rounded text-sm mt-auto"
            >
              <FileText className="w-4 h-4" />
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Output */}
      <div className="flex-1 overflow-auto bg-scada-panel border border-scada-border rounded-lg p-4">
        {reportData ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {reportType === 'daily-load' ? 'Daily Load Report' : 'Alarm Summary Report'}
              </h3>
              <button className="flex items-center gap-1 px-3 py-1 bg-scada-bg border border-scada-border rounded text-sm hover:bg-scada-border/50">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
            <pre className="text-xs font-mono bg-scada-bg p-4 rounded overflow-auto">
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a report type and click Generate
          </div>
        )}
      </div>
    </div>
  );
}
