import { Upload, Cpu, Network, Play } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload Diagram',
    description: 'Upload your hand-drawn SLD, photograph, scanned PDF, or any document containing the substation diagram.',
    color: 'from-blue-500 to-blue-600',
    glowColor: 'shadow-blue-500/20',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'AI Analysis',
    description: 'Our engine detects equipment symbols (CBs, transformers, bus bars), connections, labels, and voltage levels automatically.',
    color: 'from-cyan-500 to-cyan-600',
    glowColor: 'shadow-cyan-500/20',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Network,
    number: '03',
    title: 'Generate Digital SLD',
    description: 'A fully interactive, IEC-compliant Single Line Diagram is generated with proper symbols, color coding, and topology.',
    color: 'from-emerald-500 to-emerald-600',
    glowColor: 'shadow-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Play,
    number: '04',
    title: 'Go Live',
    description: 'Connect to real-time data sources, configure alarms, and deploy your SCADA-ready SLD with live monitoring in minutes.',
    color: 'from-purple-500 to-purple-600',
    glowColor: 'shadow-purple-500/20',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] uppercase text-blue-400 font-medium">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 text-white">
            From sketch to SCADA in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              four simple steps
            </span>
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="group relative">
              {/* Connector line (between cards on desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-3 w-6 border-t border-dashed border-gray-700 z-10" />
              )}

              <div className="relative h-full rounded-2xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm p-6 hover:border-gray-700 transition-all duration-300 hover:-translate-y-1 group-hover:shadow-xl">
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${step.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

                {/* Step number */}
                <div className="text-xs text-gray-600 font-mono font-bold mb-4">{step.number}</div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
