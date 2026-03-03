import { useState } from 'react';
import { DemoSimulationProvider } from '@/components/demo/DemoSimulationContext';
import DemoSLDCanvas from '@/components/demo/DemoSLDCanvas';
import DemoControlPanel from '@/components/demo/DemoControlPanel';
import DemoAlarmPanel from '@/components/demo/DemoAlarmPanel';
import { Monitor, MousePointerClick, Timer, AlertTriangle, TrendingUp, Bell, BarChart3, Activity } from 'lucide-react';

// Import new page components
import DemoTrendsPage from '@/components/demo/DemoTrendsPage';
import DemoAlarmsPage from '@/components/demo/DemoAlarmsPage';
import DemoAnalyticsPage from '@/components/demo/DemoAnalyticsPage';

type DemoPageType = 'sld' | 'trends' | 'alarms' | 'analytics';

const DEMO_PAGES = [
  { id: 'sld', label: 'Substation SLD', icon: Activity },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'alarms', label: 'Alarms', icon: Bell },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const;

export default function DemoPage() {
  const [activePage, setActivePage] = useState<DemoPageType>('sld');

  return (
    <DemoSimulationProvider>
      <div className="bg-gray-50">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="w-7 h-7" />
              <h1 className="text-2xl font-bold">Interactive SCADA Demo</h1>
            </div>
            <p className="text-blue-100 max-w-2xl">
              Explore a fully simulated 33/11kV distribution substation with dynamic energization, 
              real-time trends, alarm management, and analytics.
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                <MousePointerClick className="w-4 h-4" />
                Click breakers to toggle
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                <Timer className="w-4 h-4" />
                Readings update every 2s
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
                <AlertTriangle className="w-4 h-4" />
                Random trips every ~15s
              </div>
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1">
              {DEMO_PAGES.map((page) => {
                const IconComponent = page.icon;
                const isActive = activePage === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id as DemoPageType)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {page.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {activePage === 'sld' && (
            <>
              <div 
                className="relative flex bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" 
                style={{ 
                  height: '70vh', 
                  minHeight: 500, 
                  touchAction: 'manipulation',
                  overscrollBehavior: 'contain'
                }}
              >
                <div className="flex-1 relative">
                  <DemoSLDCanvas />
                  <DemoAlarmPanel />
                </div>
                <DemoControlPanel />
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <LegendItem color="#DC2626" label="33kV Energized (Red)" />
                <LegendItem color="#16A34A" label="11kV Energized (Green)" />
                <LegendItem color="#94A3B8" label="De-energized (Gray)" />
                <LegendItem color="#DC2626" filled label="CB Closed" />
              </div>

              <p className="mt-6 text-center text-sm text-gray-500">
                <span className="font-medium">SLD Controls:</span> Mouse wheel over SLD to zoom | Alt + Drag to pan | Click breakers to toggle | 
                <span className="font-medium">Visual:</span> Bus colors change based on energization state | This demo runs entirely in your browser
              </p>
            </>
          )}
          
          {activePage === 'trends' && <DemoTrendsPage />}
          {activePage === 'alarms' && <DemoAlarmsPage />}
          {activePage === 'analytics' && <DemoAnalyticsPage />}
        </div>
      </div>
    </DemoSimulationProvider>
  );
}

function LegendItem({ color, label, filled }: { color: string; label: string; filled?: boolean }) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
      <div
        className="w-4 h-4 rounded"
        style={{
          backgroundColor: filled !== false ? color : 'transparent',
          border: `2px solid ${color}`,
        }}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}
