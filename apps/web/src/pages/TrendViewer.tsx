import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { useRealtimeStore } from '@/stores/realtimeStore';
import {
  TrendingUp, Plus, X, Save, Upload, Pause, Play, Settings, Download, Eye, EyeOff,
} from 'lucide-react';

interface Pen {
  tagName: string;
  color: string;
  lineWidth: number;
  yAxisId: string;
  visible: boolean;
  label?: string;
}

interface YAxis {
  id: string;
  label: string;
  min: number | null;
  max: number | null;
  position: 'left' | 'right';
  color: string;
}

interface DataPoint {
  timestamp: number;
  value: number;
}

const DEFAULT_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

const TIME_RANGES = [
  { label: '1m', seconds: 60 },
  { label: '5m', seconds: 300 },
  { label: '15m', seconds: 900 },
  { label: '1h', seconds: 3600 },
  { label: '4h', seconds: 14400 },
  { label: '8h', seconds: 28800 },
  { label: '24h', seconds: 86400 },
  { label: '7d', seconds: 604800 },
];

export default function TrendViewer() {
  const { projectId } = useParams<{ projectId: string }>();
  const values = useRealtimeStore(s => s.values);
  const svgRef = useRef<SVGSVGElement>(null);

  const [pens, setPens] = useState<Pen[]>([]);
  const [yAxes, setYAxes] = useState<YAxis[]>([{ id: 'y1', label: 'Y1', min: null, max: null, position: 'left', color: '#FFFFFF' }]);
  const [timeRangeSec, setTimeRangeSec] = useState(300);
  const [paused, setPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [penData, setPenData] = useState<Record<string, DataPoint[]>>({});
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);
  const [configName, setConfigName] = useState('');
  const [newPenTag, setNewPenTag] = useState('');

  // Chart dimensions
  const MARGIN = { top: 30, right: 60, bottom: 40, left: 60 };
  const [chartSize, setChartSize] = useState({ width: 1000, height: 500 });

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const resize = () => setChartSize({ width: el.clientWidth, height: el.clientHeight });
    resize();
    const obs = new ResizeObserver(resize);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!projectId) return;
    api.get('/tags', { params: { projectId } }).then(r => setTags(r.data.map((t: any) => t.name)));
    api.get('/trend-configs/configs', { params: { projectId } }).then(r => setConfigs(r.data)).catch(() => {});
  }, [projectId]);

  // Accumulate real-time data
  useEffect(() => {
    if (paused) return;
    const now = Date.now();
    setPenData(prev => {
      const next = { ...prev };
      for (const pen of pens) {
        const v = values[pen.tagName];
        if (v === undefined) continue;
        const val = typeof v === 'number' ? v : typeof v === 'object' && v !== null && 'value' in v ? Number((v as any).value) : parseFloat(String(v));
        if (isNaN(val)) continue;
        const arr = [...(next[pen.tagName] || []), { timestamp: now, value: val }];
        // Keep last timeRange * 2 worth of data
        const cutoff = now - timeRangeSec * 2000;
        next[pen.tagName] = arr.filter(d => d.timestamp > cutoff);
      }
      return next;
    });
  }, [values, pens, paused, timeRangeSec]);

  const plotWidth = chartSize.width - MARGIN.left - MARGIN.right;
  const plotHeight = chartSize.height - MARGIN.top - MARGIN.bottom;

  const now = Date.now();
  const timeStart = now - timeRangeSec * 1000;
  const timeEnd = now;

  const xScale = useCallback((t: number) => MARGIN.left + ((t - timeStart) / (timeEnd - timeStart)) * plotWidth, [timeStart, timeEnd, plotWidth]);
  const xInverse = useCallback((px: number) => timeStart + ((px - MARGIN.left) / plotWidth) * (timeEnd - timeStart), [timeStart, timeEnd, plotWidth]);

  const getYRange = useCallback((axisId: string) => {
    const axis = yAxes.find(a => a.id === axisId);
    const pensOnAxis = pens.filter(p => p.yAxisId === axisId && p.visible);
    let min = axis?.min ?? Infinity;
    let max = axis?.max ?? -Infinity;
    if (min === Infinity || max === -Infinity) {
      for (const pen of pensOnAxis) {
        const data = penData[pen.tagName] || [];
        for (const d of data) {
          if (d.timestamp < timeStart) continue;
          if (min === Infinity || d.value < min) min = d.value;
          if (max === -Infinity || d.value > max) max = d.value;
        }
      }
      if (min === Infinity) min = 0;
      if (max === -Infinity) max = 100;
      const range = max - min || 1;
      if (axis?.min == null) min -= range * 0.1;
      if (axis?.max == null) max += range * 0.1;
    }
    return { min, max };
  }, [yAxes, pens, penData, timeStart]);

  const yScale = useCallback((value: number, axisId: string) => {
    const { min, max } = getYRange(axisId);
    return MARGIN.top + plotHeight - ((value - min) / (max - min)) * plotHeight;
  }, [getYRange, plotHeight]);

  // Build SVG paths for each pen
  const penPaths = useMemo(() => {
    return pens.filter(p => p.visible).map(pen => {
      const data = (penData[pen.tagName] || []).filter(d => d.timestamp >= timeStart && d.timestamp <= timeEnd);
      if (data.length < 2) return { pen, path: '', currentValue: data[0]?.value };
      const points = data.map(d => `${xScale(d.timestamp)},${yScale(d.value, pen.yAxisId)}`);
      return { pen, path: `M${points.join('L')}`, currentValue: data[data.length - 1]?.value };
    });
  }, [pens, penData, timeStart, timeEnd, xScale, yScale]);

  // Time axis labels
  const timeLabels = useMemo(() => {
    const labels: { x: number; text: string }[] = [];
    const count = Math.min(8, Math.floor(plotWidth / 100));
    for (let i = 0; i <= count; i++) {
      const t = timeStart + (i / count) * (timeEnd - timeStart);
      const d = new Date(t);
      const text = timeRangeSec <= 300 ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : timeRangeSec <= 86400 ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      labels.push({ x: xScale(t), text });
    }
    return labels;
  }, [timeStart, timeEnd, plotWidth, xScale, timeRangeSec]);

  // Y axis labels
  const yAxisLabels = useMemo(() => {
    const result: { axisId: string; labels: { y: number; text: string }[]; position: 'left' | 'right'; color: string }[] = [];
    for (const axis of yAxes) {
      const { min, max } = getYRange(axis.id);
      const count = 5;
      const labels: { y: number; text: string }[] = [];
      for (let i = 0; i <= count; i++) {
        const val = min + (i / count) * (max - min);
        labels.push({ y: yScale(val, axis.id), text: val.toFixed(1) });
      }
      result.push({ axisId: axis.id, labels, position: axis.position, color: axis.color });
    }
    return result;
  }, [yAxes, getYRange, yScale]);

  // Grid lines
  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    // Horizontal
    for (let i = 0; i <= 5; i++) {
      const y = MARGIN.top + (i / 5) * plotHeight;
      lines.push({ x1: MARGIN.left, y1: y, x2: MARGIN.left + plotWidth, y2: y });
    }
    // Vertical
    const count = Math.min(8, Math.floor(plotWidth / 100));
    for (let i = 0; i <= count; i++) {
      const x = MARGIN.left + (i / count) * plotWidth;
      lines.push({ x1: x, y1: MARGIN.top, x2: x, y2: MARGIN.top + plotHeight });
    }
    return lines;
  }, [plotWidth, plotHeight]);

  // Crosshair tooltip values
  const crosshairValues = useMemo(() => {
    if (!crosshair) return [];
    const t = xInverse(crosshair.x);
    return pens.filter(p => p.visible).map(pen => {
      const data = penData[pen.tagName] || [];
      let closest = data[0];
      let minDist = Infinity;
      for (const d of data) {
        const dist = Math.abs(d.timestamp - t);
        if (dist < minDist) { minDist = dist; closest = d; }
      }
      return { pen, value: closest?.value, timestamp: closest?.timestamp };
    });
  }, [crosshair, pens, penData, xInverse]);

  const addPen = () => {
    if (!newPenTag) return;
    setPens(prev => [...prev, {
      tagName: newPenTag,
      color: DEFAULT_COLORS[prev.length % DEFAULT_COLORS.length],
      lineWidth: 2,
      yAxisId: yAxes[0]?.id || 'y1',
      visible: true,
      label: newPenTag,
    }]);
    setNewPenTag('');
  };

  const removePen = (tagName: string) => {
    setPens(prev => prev.filter(p => p.tagName !== tagName));
  };

  const togglePenVisibility = (tagName: string) => {
    setPens(prev => prev.map(p => p.tagName === tagName ? { ...p, visible: !p.visible } : p));
  };

  const saveConfig = async () => {
    if (!configName || !projectId) return;
    await api.post('/trend-configs/configs', {
      name: configName,
      pens,
      yAxes,
      timeRange: timeRangeSec,
      refreshRate: 1000,
      showGrid: true,
      showLegend: true,
      projectId,
    });
    setConfigs(prev => [...prev, { name: configName }]);
    setConfigName('');
  };

  const loadConfig = async (config: any) => {
    setPens(config.pens || []);
    setYAxes(config.yAxes || [{ id: 'y1', label: 'Y1', min: null, max: null, position: 'left', color: '#FFFFFF' }]);
    setTimeRangeSec(config.timeRange || 300);
  };

  const exportCSV = () => {
    const header = ['Timestamp', ...pens.map(p => p.tagName)].join(',');
    const allTimestamps = new Set<number>();
    for (const pen of pens) {
      for (const d of penData[pen.tagName] || []) allTimestamps.add(d.timestamp);
    }
    const sorted = Array.from(allTimestamps).sort();
    const rows = sorted.map(ts => {
      const vals = pens.map(pen => {
        const data = penData[pen.tagName] || [];
        const d = data.find(x => x.timestamp === ts);
        return d?.value ?? '';
      });
      return [new Date(ts).toISOString(), ...vals].join(',');
    });
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'trend-data.csv';
    a.click();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold text-white mr-4">Trend Viewer</h1>

        {/* Time range buttons */}
        {TIME_RANGES.map(tr => (
          <button key={tr.label} onClick={() => setTimeRangeSec(tr.seconds)}
            className={`px-2 py-1 text-xs rounded ${timeRangeSec === tr.seconds ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >{tr.label}</button>
        ))}

        <div className="flex-1" />

        <button onClick={() => setPaused(!paused)} className={`p-1.5 rounded ${paused ? 'text-green-400 hover:bg-green-900/30' : 'text-yellow-400 hover:bg-yellow-900/30'}`} title={paused ? 'Resume' : 'Pause'}>
          {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
        <button onClick={exportCSV} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Export CSV">
          <Download className="w-4 h-4" />
        </button>
        <button onClick={() => setShowConfig(!showConfig)} className={`p-1.5 rounded ${showConfig ? 'text-blue-400 bg-blue-900/30' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`} title="Configure">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden gap-2">
        {/* Chart area */}
        <div className="flex-1 bg-gray-900 rounded-lg border border-gray-700 relative overflow-hidden">
          <svg
            ref={svgRef}
            width={chartSize.width}
            height={chartSize.height}
            className="w-full h-full"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              if (x >= MARGIN.left && x <= MARGIN.left + plotWidth && y >= MARGIN.top && y <= MARGIN.top + plotHeight) {
                setCrosshair({ x, y });
              } else {
                setCrosshair(null);
              }
            }}
            onMouseLeave={() => setCrosshair(null)}
          >
            {/* Grid */}
            {gridLines.map((l, i) => (
              <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#374151" strokeWidth={0.5} />
            ))}

            {/* Plot area clip */}
            <defs>
              <clipPath id="plot-clip">
                <rect x={MARGIN.left} y={MARGIN.top} width={plotWidth} height={plotHeight} />
              </clipPath>
            </defs>

            {/* Pen lines */}
            <g clipPath="url(#plot-clip)">
              {penPaths.map(({ pen, path }) => path && (
                <path key={pen.tagName} d={path} fill="none" stroke={pen.color} strokeWidth={pen.lineWidth} />
              ))}
            </g>

            {/* X axis labels */}
            {timeLabels.map((l, i) => (
              <text key={i} x={l.x} y={chartSize.height - 5} textAnchor="middle" fontSize={10} fill="#9CA3AF">{l.text}</text>
            ))}

            {/* Y axis labels */}
            {yAxisLabels.map(axis => axis.labels.map((l, i) => (
              <text key={`${axis.axisId}-${i}`}
                x={axis.position === 'left' ? MARGIN.left - 8 : MARGIN.left + plotWidth + 8}
                y={l.y + 3}
                textAnchor={axis.position === 'left' ? 'end' : 'start'}
                fontSize={10} fill={axis.color === '#FFFFFF' ? '#9CA3AF' : axis.color}
              >{l.text}</text>
            )))}

            {/* Plot border */}
            <rect x={MARGIN.left} y={MARGIN.top} width={plotWidth} height={plotHeight} fill="none" stroke="#4B5563" strokeWidth={1} />

            {/* Crosshair */}
            {crosshair && (
              <>
                <line x1={crosshair.x} y1={MARGIN.top} x2={crosshair.x} y2={MARGIN.top + plotHeight} stroke="#6B7280" strokeWidth={1} strokeDasharray="3,3" />
                <line x1={MARGIN.left} y1={crosshair.y} x2={MARGIN.left + plotWidth} y2={crosshair.y} stroke="#6B7280" strokeWidth={1} strokeDasharray="3,3" />
              </>
            )}

            {/* Crosshair tooltip */}
            {crosshair && crosshairValues.length > 0 && (
              <g transform={`translate(${Math.min(crosshair.x + 10, chartSize.width - 180)}, ${Math.max(crosshair.y - 10, MARGIN.top)})`}>
                <rect x={0} y={0} width={170} height={crosshairValues.length * 18 + 22} rx={4} fill="#1F2937" stroke="#4B5563" opacity={0.95} />
                <text x={8} y={14} fontSize={10} fill="#9CA3AF">{new Date(xInverse(crosshair.x)).toLocaleTimeString()}</text>
                {crosshairValues.map((cv, i) => (
                  <g key={cv.pen.tagName} transform={`translate(8, ${24 + i * 18})`}>
                    <rect x={0} y={-4} width={8} height={8} fill={cv.pen.color} rx={2} />
                    <text x={14} y={4} fontSize={10} fill="#D1D5DB">{cv.pen.label || cv.pen.tagName}: {cv.value?.toFixed(2) ?? '—'}</text>
                  </g>
                ))}
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="absolute top-2 left-16 flex items-center gap-3 flex-wrap">
            {pens.map(pen => (
              <button key={pen.tagName} onClick={() => togglePenVisibility(pen.tagName)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs ${pen.visible ? 'bg-gray-800/80' : 'bg-gray-800/40 opacity-50'}`}
              >
                <div className="w-3 h-1 rounded" style={{ backgroundColor: pen.color }} />
                <span className="text-gray-300">{pen.label || pen.tagName}</span>
                {pen.visible && penPaths.find(p => p.pen.tagName === pen.tagName)?.currentValue != null && (
                  <span className="text-white font-mono font-bold">{penPaths.find(p => p.pen.tagName === pen.tagName)?.currentValue?.toFixed(2)}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Config panel */}
        {showConfig && (
          <div className="w-72 bg-gray-800 rounded-lg border border-gray-700 p-3 overflow-y-auto space-y-4">
            <h3 className="text-sm font-semibold text-white">Pen Configuration</h3>

            {/* Add pen */}
            <div className="flex gap-1">
              <select value={newPenTag} onChange={e => setNewPenTag(e.target.value)} className="flex-1 px-2 py-1 text-sm bg-gray-900 border border-gray-600 rounded text-gray-900 bg-white">
                <option value="">Add tag...</option>
                {tags.filter(t => !pens.find(p => p.tagName === t)).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={addPen} className="px-2 py-1 bg-blue-600 text-white rounded text-sm"><Plus className="w-4 h-4" /></button>
            </div>

            {/* Pen list */}
            {pens.map((pen, i) => (
              <div key={pen.tagName} className="bg-gray-900 rounded p-2 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium truncate">{pen.tagName}</span>
                  <button onClick={() => removePen(pen.tagName)} className="text-gray-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <input type="color" value={pen.color} onChange={e => setPens(prev => prev.map(p => p.tagName === pen.tagName ? { ...p, color: e.target.value } : p))} className="w-6 h-6 rounded border-0 cursor-pointer" />
                  <select value={pen.yAxisId} onChange={e => setPens(prev => prev.map(p => p.tagName === pen.tagName ? { ...p, yAxisId: e.target.value } : p))} className="flex-1 px-1 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-900 bg-white text-xs">
                    {yAxes.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                  </select>
                  <button onClick={() => togglePenVisibility(pen.tagName)} className={pen.visible ? 'text-blue-400' : 'text-gray-600'}>
                    {pen.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}

            {/* Save/Load */}
            <div className="border-t border-gray-700 pt-3 space-y-2">
              <div className="flex gap-1">
                <input value={configName} onChange={e => setConfigName(e.target.value)} placeholder="Config name" className="flex-1 px-2 py-1 text-sm bg-gray-900 border border-gray-600 rounded text-white" />
                <button onClick={saveConfig} className="px-2 py-1 bg-green-600 text-white rounded text-sm"><Save className="w-4 h-4" /></button>
              </div>
              {configs.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs text-gray-400">Saved configs:</span>
                  {configs.map(c => (
                    <button key={c.id || c.name} onClick={() => loadConfig(c)} className="block w-full text-left px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 rounded">
                      <Upload className="w-3 h-3 inline mr-1" />{c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
