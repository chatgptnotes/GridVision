import { useState, useCallback } from 'react';
import { DemoSimulationProvider } from '@/components/demo/DemoSimulationContext';
import DemoSLDCanvas from '@/components/demo/DemoSLDCanvas';
import DemoControlPanel from '@/components/demo/DemoControlPanel';
import DemoAlarmPanel from '@/components/demo/DemoAlarmPanel';
import {
  Activity, TrendingUp, Bell, BarChart3,
  Maximize2, Minimize2, Circle, Clock, Radio,
} from 'lucide-react';

import DemoTrendsPage from '@/components/demo/DemoTrendsPage';
import DemoAlarmsPage from '@/components/demo/DemoAlarmsPage';
import DemoAnalyticsPage from '@/components/demo/DemoAnalyticsPage';

type DemoTab = 'sld' | 'trends' | 'alarms' | 'analytics';

const TABS = [
  { id: 'sld' as const, label: 'Substation SLD', icon: Activity },
  { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
  { id: 'alarms' as const, label: 'Alarms', icon: Bell },
  { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
];

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<DemoTab>('sld');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const demoEl = document.getElementById('demo-container');
    if (!demoEl) return;
    if (!document.fullscreenElement) {
      demoEl.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  return (
    <DemoSimulationProvider>
      {/* Page content within PublicLayout - header/footer come from PublicLayout */}
      <div className="bg-gray-50">

        {/* Demo toolbar */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Station info */}
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-gray-900 text-sm">33/11kV Demo Substation</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium uppercase tracking-wider">Simulation</span>
              </div>

              <div className="h-5 w-px bg-gray-200 hidden sm:block" />

              {/* Tabs */}
              <div className="flex gap-0.5">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Legend */}
              <div className="hidden lg:flex items-center gap-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-red-500 text-red-500" />
                  Energized
                </span>
                <span className="flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  De-energized
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  60s refresh
                </span>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Main demo area */}
        <div
          id="demo-container"
          className={`${isFullscreen ? 'bg-white' : ''}`}
        >
          <div className={`${isFullscreen ? '' : 'max-w-[1600px] mx-auto px-4 py-4'}`}>
            {activeTab === 'sld' && (
              <div
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex"
                style={{ height: isFullscreen ? '100vh' : '70vh', minHeight: 500 }}
              >
                <div className="flex-1 relative">
                  <DemoSLDCanvas />
                  <DemoAlarmPanel />

                  {/* Zoom hints */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] text-gray-400 bg-white/90 backdrop-blur rounded-md px-2 py-1 border border-gray-200 shadow-sm">
                    <span>Scroll to zoom</span>
                    <span className="text-gray-300">|</span>
                    <span>Drag to pan</span>
                    <span className="text-gray-300">|</span>
                    <span>Double-click to reset</span>
                    <span className="text-gray-300">|</span>
                    <span>Click breakers to toggle</span>
                  </div>
                </div>
                <DemoControlPanel />
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4" style={{ minHeight: '70vh' }}>
                <DemoTrendsPage />
              </div>
            )}

            {activeTab === 'alarms' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4" style={{ minHeight: '70vh' }}>
                <DemoAlarmsPage />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4" style={{ minHeight: '70vh' }}>
                <DemoAnalyticsPage />
              </div>
            )}
          </div>

          {/* Bottom info bar (inside demo container for fullscreen) */}
          {isFullscreen && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-gray-400 px-4 py-1.5 flex items-center justify-between text-[11px] z-50">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  System Online
                </span>
                <span>Protocol: IEC 61850 (Simulated)</span>
              </div>
              <div className="flex items-center gap-4">
                <span>GridVision SCADA v2.0</span>
                <span className="text-gray-500">drmhope.com | A Bettroi Product</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </DemoSimulationProvider>
  );
}
