import {
  Zap, Shield, Gauge, Bell, LineChart, FileText,
  Wifi, Layout, MonitorCheck, Lock, Database, Globe,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Real-Time Monitoring',
    description: 'Live data overlay on your SLD with sub-second latency from IEDs and RTUs.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: Shield,
    title: 'IEC 61850 Compliant',
    description: 'Standard-compliant equipment symbols, color coding, and naming conventions.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Gauge,
    title: 'Power Factor & Load',
    description: 'Interactive gauges, load distribution bars, and voltage profile visualizations.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    icon: Bell,
    title: 'Smart Alarms',
    description: 'Priority-based alarm management with visual badges directly on the SLD.',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
  {
    icon: LineChart,
    title: 'Historical Trends',
    description: 'Click any measurement to view historical trends with zoom and export.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Layout,
    title: 'Auto-Layout Engine',
    description: 'Intelligently positions equipment, bus bars, and connections for optimal clarity.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: MonitorCheck,
    title: 'SBO Control',
    description: 'Select-Before-Operate control directly from the SLD with interlock validation.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: Lock,
    title: 'Role-Based Access',
    description: 'Granular RBAC with separate permissions for viewing, control, and configuration.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
  },
  {
    icon: Wifi,
    title: 'Multi-Protocol',
    description: 'Supports IEC 61850, Modbus TCP, and DNP3 for seamless field device integration.',
    color: 'text-teal-400',
    bg: 'bg-teal-400/10',
  },
  {
    icon: Database,
    title: 'Data Historian',
    description: '5-year data retention with TimescaleDB compression and continuous aggregates.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
  },
  {
    icon: FileText,
    title: 'Automated Reports',
    description: 'Daily load, monthly summary, and alarm reports generated automatically.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Globe,
    title: 'Web + Desktop',
    description: 'Deploy as a web app or Electron desktop application for control room PCs.',
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] uppercase text-emerald-400 font-medium">Platform Features</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-white">
            Everything you need for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              modern SCADA
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Ampris combines AI-powered SLD generation with a full-featured SCADA platform
            built for smart distribution substations.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative rounded-xl border border-gray-800 bg-gray-900/30 p-5 hover:border-gray-700 hover:bg-gray-800/40 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
