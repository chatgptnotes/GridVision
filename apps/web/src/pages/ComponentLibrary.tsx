import { useState, useMemo } from 'react';
import { Search, X, Copy, Check, GripVertical } from 'lucide-react';
import clsx from 'clsx';
import {
  CBSymbol,
  IsolatorSymbol,
  EarthSwitchSymbol,
  FuseSymbol,
  ContactorSymbol,
  LoadBreakSwitchSymbol,
  TransformerSymbol,
  GeneratorSymbol,
  MotorSymbol,
  CapacitorBankSymbol,
  ReactorSymbol,
  BatterySymbol,
  CTSymbol,
  PTSymbol,
  MeterSymbol,
  TransducerSymbol,
  RelaySymbol,
  BusBarSymbol,
  CableSymbol,
  LightningArresterSymbol,
  GroundSymbol,
  FeederSymbol,
  DGSetSymbol,
  AVRSymbol,
  RTCCSymbol,
  AnnunciatorSymbol,
} from '@/components/scada-symbols';

interface SymbolEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  states?: string[];
  component: React.FC<Record<string, unknown>>;
  defaultProps?: Record<string, unknown>;
}

const SYMBOL_CATALOG: SymbolEntry[] = [
  // Switchgear
  { id: 'cb', name: 'Circuit Breaker', category: 'Switchgear', description: 'IEC circuit breaker with OPEN/CLOSED/TRIPPED states', states: ['OPEN', 'CLOSED', 'TRIPPED'], component: CBSymbol as React.FC<Record<string, unknown>> },
  { id: 'isolator', name: 'Isolator', category: 'Switchgear', description: 'IEC disconnector/isolator blade switch', states: ['OPEN', 'CLOSED'], component: IsolatorSymbol as React.FC<Record<string, unknown>> },
  { id: 'earth-switch', name: 'Earth Switch', category: 'Switchgear', description: 'IEC earth switch with ground symbol', states: ['OPEN', 'CLOSED'], component: EarthSwitchSymbol as React.FC<Record<string, unknown>> },
  { id: 'fuse', name: 'Fuse', category: 'Switchgear', description: 'IEC fuse with healthy/blown indication', states: ['HEALTHY', 'BLOWN'], component: FuseSymbol as React.FC<Record<string, unknown>> },
  { id: 'contactor', name: 'Contactor', category: 'Switchgear', description: 'Contactor with magnetic coil indicator', states: ['OPEN', 'CLOSED'], component: ContactorSymbol as React.FC<Record<string, unknown>> },
  { id: 'lbs', name: 'Load Break Switch', category: 'Switchgear', description: 'Load break switch with arc chamber', states: ['OPEN', 'CLOSED'], component: LoadBreakSwitchSymbol as React.FC<Record<string, unknown>> },
  // Power Equipment
  { id: 'transformer', name: 'Power Transformer', category: 'Power Equipment', description: '2-winding/3-winding transformer (IEC coupled coils)', states: ['ENERGIZED', 'DE_ENERGIZED'], component: TransformerSymbol as React.FC<Record<string, unknown>> },
  { id: 'generator', name: 'Generator', category: 'Power Equipment', description: 'Generator with running/stopped/fault states', states: ['RUNNING', 'STOPPED', 'FAULT'], component: GeneratorSymbol as React.FC<Record<string, unknown>> },
  { id: 'motor', name: 'Motor', category: 'Power Equipment', description: 'Motor with running/stopped/fault states', states: ['RUNNING', 'STOPPED', 'FAULT'], component: MotorSymbol as React.FC<Record<string, unknown>> },
  { id: 'capacitor', name: 'Capacitor Bank', category: 'Power Equipment', description: 'IEC capacitor bank (parallel plates)', states: ['CONNECTED', 'DISCONNECTED'], component: CapacitorBankSymbol as React.FC<Record<string, unknown>> },
  { id: 'reactor', name: 'Reactor', category: 'Power Equipment', description: 'Reactor/inductor coil symbol', states: ['ENERGIZED', 'DE_ENERGIZED'], component: ReactorSymbol as React.FC<Record<string, unknown>> },
  { id: 'battery', name: 'Battery/UPS', category: 'Power Equipment', description: 'Battery with charge level and status', states: ['CHARGING', 'DISCHARGING', 'STANDBY', 'FAULT'], component: BatterySymbol as React.FC<Record<string, unknown>> },
  // Measurement
  { id: 'ct', name: 'Current Transformer', category: 'Measurement', description: 'CT with configurable ratio label', component: CTSymbol as React.FC<Record<string, unknown>>, defaultProps: { ratio: '200/5A' } },
  { id: 'pt', name: 'Voltage Transformer', category: 'Measurement', description: 'PT/VT with configurable ratio', component: PTSymbol as React.FC<Record<string, unknown>>, defaultProps: { ratio: '33kV/110V' } },
  { id: 'meter', name: 'Panel Meter', category: 'Measurement', description: 'Meter with V/A/W/Hz/PF types', component: MeterSymbol as React.FC<Record<string, unknown>>, defaultProps: { meterType: 'V' } },
  { id: 'transducer', name: 'Transducer', category: 'Measurement', description: 'Transducer with signal I/O arrows', component: TransducerSymbol as React.FC<Record<string, unknown>> },
  // Protection
  { id: 'relay', name: 'Protection Relay', category: 'Protection', description: 'Relay with ANSI device number and status', states: ['NORMAL', 'OPERATED', 'BLOCKED'], component: RelaySymbol as React.FC<Record<string, unknown>>, defaultProps: { ansiNumber: 50 } },
  // Infrastructure
  { id: 'busbar', name: 'Bus Bar', category: 'Infrastructure', description: 'Bus bar colored by voltage level', component: BusBarSymbol as React.FC<Record<string, unknown>>, defaultProps: { voltageLevel: 33 } },
  { id: 'cable', name: 'Cable/Line', category: 'Infrastructure', description: 'Cable with direction arrow', component: CableSymbol as React.FC<Record<string, unknown>> },
  { id: 'la', name: 'Surge Arrester', category: 'Infrastructure', description: 'IEC lightning/surge arrester', component: LightningArresterSymbol as React.FC<Record<string, unknown>> },
  { id: 'ground', name: 'Ground/Earth', category: 'Infrastructure', description: 'Ground symbol (standard/chassis/signal)', component: GroundSymbol as React.FC<Record<string, unknown>> },
  { id: 'feeder', name: 'Feeder', category: 'Infrastructure', description: 'Overhead line/feeder with direction', component: FeederSymbol as React.FC<Record<string, unknown>>, defaultProps: { direction: 'incoming' } },
  // Miscellaneous
  { id: 'dgset', name: 'DG Set', category: 'Miscellaneous', description: 'Diesel generator set', states: ['RUNNING', 'STOPPED', 'FAULT'], component: DGSetSymbol as React.FC<Record<string, unknown>> },
  { id: 'avr', name: 'AVR', category: 'Miscellaneous', description: 'Automatic voltage regulator', states: ['AUTO', 'MANUAL', 'FAULT'], component: AVRSymbol as React.FC<Record<string, unknown>> },
  { id: 'rtcc', name: 'RTCC', category: 'Miscellaneous', description: 'Remote tap change controller', states: ['AUTO', 'MANUAL', 'LOCAL'], component: RTCCSymbol as React.FC<Record<string, unknown>>, defaultProps: { tapPosition: 16 } },
  { id: 'annunciator', name: 'Annunciator', category: 'Miscellaneous', description: 'Alarm annunciator window panel', component: AnnunciatorSymbol as React.FC<Record<string, unknown>>, defaultProps: { windows: 8, activeWindows: [1, 4] } },
];

const CATEGORIES = ['All', 'Switchgear', 'Power Equipment', 'Measurement', 'Protection', 'Infrastructure', 'Miscellaneous'];

export default function ComponentLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolEntry | null>(null);
  const [activeState, setActiveState] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    return SYMBOL_CATALOG.filter((s) => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SYMBOL_CATALOG.length };
    SYMBOL_CATALOG.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  const handleCopySvg = () => {
    if (!selectedSymbol) return;
    const el = document.getElementById('symbol-preview-svg');
    if (el) {
      const svgContent = el.innerHTML;
      navigator.clipboard.writeText(svgContent).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-scada-border px-6 py-4 shrink-0">
        <h1 className="text-xl font-semibold text-white mb-1">SCADA Component Library</h1>
        <p className="text-sm text-gray-400">
          {SYMBOL_CATALOG.length} IEC/IEEE standard electrical symbols for SLD design
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — catalog */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-scada-border">
          {/* Search & filters */}
          <div className="px-4 py-3 border-b border-scada-border space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search symbols..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-scada-bg border border-scada-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-scada-accent"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={clsx(
                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                    activeCategory === cat
                      ? 'bg-scada-accent text-white'
                      : 'bg-scada-bg text-gray-400 hover:text-white border border-scada-border'
                  )}
                >
                  {cat} ({categoryCounts[cat] || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Symbol grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filtered.map((sym) => {
                const Comp = sym.component;
                return (
                  <button
                    key={sym.id}
                    onClick={() => {
                      setSelectedSymbol(sym);
                      setActiveState(sym.states?.[0]);
                    }}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:shadow-lg group',
                      selectedSymbol?.id === sym.id
                        ? 'border-scada-accent bg-scada-accent/10 shadow-scada-accent/20'
                        : 'border-scada-border bg-scada-panel hover:border-gray-600'
                    )}
                  >
                    <div className="w-full flex items-center justify-center h-20 bg-white/95 rounded-lg p-2 relative">
                      <Comp width={48} height={56} {...(sym.defaultProps || {})} />
                      <GripVertical className="absolute top-1 right-1 w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xs text-gray-300 text-center leading-tight font-medium">{sym.name}</span>
                  </button>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No symbols match your search.
              </div>
            )}
          </div>
        </div>

        {/* Right panel — detail view */}
        <div className="w-80 lg:w-96 flex flex-col overflow-y-auto shrink-0 bg-scada-panel">
          {selectedSymbol ? (
            <div className="p-5 space-y-5">
              {/* Preview */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">{selectedSymbol.name}</h2>
                <p className="text-xs text-gray-400 mb-3">{selectedSymbol.description}</p>
                <div id="symbol-preview-svg" className="bg-white rounded-xl p-6 flex items-center justify-center min-h-[140px]">
                  {(() => {
                    const Comp = selectedSymbol.component;
                    return <Comp width={100} height={120} state={activeState} {...(selectedSymbol.defaultProps || {})} />;
                  })()}
                </div>
              </div>

              {/* State switcher */}
              {selectedSymbol.states && selectedSymbol.states.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">States</h3>
                  <div className="flex gap-1.5 flex-wrap">
                    {selectedSymbol.states.map((st) => (
                      <button
                        key={st}
                        onClick={() => setActiveState(st)}
                        className={clsx(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          activeState === st
                            ? 'bg-scada-accent text-white'
                            : 'bg-scada-bg text-gray-400 border border-scada-border hover:text-white'
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                  {/* All states preview */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {selectedSymbol.states.map((st) => {
                      const Comp = selectedSymbol.component;
                      return (
                        <div
                          key={st}
                          onClick={() => setActiveState(st)}
                          className={clsx(
                            'bg-white rounded-lg p-2 flex flex-col items-center gap-1 cursor-pointer border-2 transition-colors',
                            activeState === st ? 'border-scada-accent' : 'border-transparent'
                          )}
                        >
                          <Comp width={36} height={44} state={st} {...(selectedSymbol.defaultProps || {})} />
                          <span className="text-[9px] text-gray-500 font-medium">{st}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Properties */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Props</h3>
                <div className="bg-scada-bg rounded-lg border border-scada-border overflow-hidden">
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-scada-border">
                        <td className="px-3 py-1.5 text-gray-400">width</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">number</td>
                      </tr>
                      <tr className="border-b border-scada-border">
                        <td className="px-3 py-1.5 text-gray-400">height</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">number</td>
                      </tr>
                      {selectedSymbol.states && (
                        <tr className="border-b border-scada-border">
                          <td className="px-3 py-1.5 text-gray-400">state</td>
                          <td className="px-3 py-1.5 text-gray-300 font-mono text-[10px]">{selectedSymbol.states.map((s) => `'${s}'`).join(' | ')}</td>
                        </tr>
                      )}
                      <tr className="border-b border-scada-border">
                        <td className="px-3 py-1.5 text-gray-400">color</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">string</td>
                      </tr>
                      <tr className="border-b border-scada-border">
                        <td className="px-3 py-1.5 text-gray-400">onClick</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">() =&gt; void</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-1.5 text-gray-400">label</td>
                        <td className="px-3 py-1.5 text-gray-300 font-mono">string</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</h3>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs bg-scada-bg text-gray-300 border border-scada-border">
                  {selectedSymbol.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopySvg}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium bg-scada-accent text-white hover:bg-scada-accent/90 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy SVG'}
                </button>
              </div>

              {/* Drag hint */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-scada-bg border border-scada-border">
                <GripVertical className="w-4 h-4 text-gray-500 shrink-0" />
                <p className="text-[11px] text-gray-500">
                  Drag symbols to the SLD Editor to place them on your single line diagram (coming soon)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-scada-bg border border-scada-border flex items-center justify-center">
                  <Search className="w-7 h-7 text-gray-600" />
                </div>
                <p className="text-sm font-medium">Select a symbol</p>
                <p className="text-xs mt-1">Click any symbol to see its states, properties, and preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
