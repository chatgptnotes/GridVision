import { ArrowDown, Zap, Sparkles } from 'lucide-react';

interface Props {
  onScrollToUpload: () => void;
}

export default function HeroSection({ onScrollToUpload }: Props) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Floating badge */}
      <div className="mb-8 animate-fade-in-down">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          AI-Powered SLD Generation
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </span>
      </div>

      {/* Main headline */}
      <h1 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight animate-fade-in">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
          Transform
        </span>{' '}
        Hand-Drawn Diagrams into{' '}
        <span className="relative inline-block">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            Digital SLDs
          </span>
          <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
            <path
              d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8"
              stroke="url(#underline-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                <stop stopColor="#22D3EE" />
                <stop offset="1" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </h1>

      {/* Subheading */}
      <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed animate-fade-in-delayed">
        Upload your hand-drawn single line diagrams, photos, PDFs, or scanned documents.
        Our intelligent engine converts them into interactive, real-time SCADA-ready
        Single Line Diagrams in seconds.
      </p>

      {/* Stats row */}
      <div className="mt-12 flex items-center gap-8 md:gap-16 animate-fade-in-delayed-2">
        <StatItem value="10x" label="Faster Design" />
        <div className="w-px h-8 bg-gray-700" />
        <StatItem value="99.2%" label="Accuracy" />
        <div className="w-px h-8 bg-gray-700" />
        <StatItem value="50+" label="Substations" />
        <div className="w-px h-8 bg-gray-700" />
        <StatItem value="IEC" label="Compliant" />
      </div>

      {/* CTA Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-fade-in-delayed-2">
        <button
          onClick={onScrollToUpload}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Upload Your Diagram
          </span>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
        </button>
        <button className="px-8 py-4 border border-gray-600 rounded-xl text-gray-300 font-medium text-lg hover:bg-white/5 hover:border-gray-500 transition-all">
          Watch Demo
        </button>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onScrollToUpload}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors animate-bounce-slow"
      >
        <span className="text-xs tracking-widest uppercase">Upload Below</span>
        <ArrowDown className="w-5 h-5" />
      </button>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5 tracking-wide">{label}</div>
    </div>
  );
}
