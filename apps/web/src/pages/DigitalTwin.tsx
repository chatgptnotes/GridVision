import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { RefreshCw, ChevronLeft, Download, Maximize, Minimize, Loader2, Box } from 'lucide-react';

interface ProjectSummary {
  id: string;
  name: string;
  _count: { mimicPages: number };
}

export default function DigitalTwin() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [elementCount, setElementCount] = useState(0);
  const navigate = useNavigate();

  // Load projects
  useEffect(() => {
    api.get('/projects').then(({ data }) => {
      setProjects(data);
      // Auto-select last used project
      const lastProject = localStorage.getItem('gridvision-last-project');
      if (lastProject && data.some((p: any) => p.id === lastProject)) {
        setSelectedProject(lastProject);
      } else if (data.length > 0) {
        setSelectedProject(data[0].id);
      }
    }).catch(() => {});
  }, []);

  const generate = useCallback(async (regenerate = false) => {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/gemini/digital-twin/${selectedProject}${regenerate ? '?regenerate=true' : ''}`);
      setImage(data.image);
      setCached(data.cached);
      setElementCount(data.elementCount || 0);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Generation failed';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // Auto-generate when project is selected
  useEffect(() => {
    if (selectedProject) {
      generate(false);
    }
  }, [selectedProject, generate]);

  const handleDownload = () => {
    if (!image) return;
    const a = document.createElement('a');
    a.href = image;
    a.download = `digital-twin-${selectedProject}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Fullscreen view
  if (fullscreen && image) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
        onClick={() => setFullscreen(false)}
      >
        <img src={image} alt="Digital Twin" className="max-w-full max-h-full object-contain" />
        <button
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
          onClick={() => setFullscreen(false)}
        >
          <Minimize className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <Box className="w-5 h-5 text-cyan-400" />
        <h1 className="text-lg font-semibold text-white">Digital Twin</h1>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="ml-4 px-3 py-1.5 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">Select project...</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <div className="flex-1" />

        {image && (
          <>
            <span className="text-xs text-gray-500">
              {elementCount} elements {cached ? '(cached)' : '(fresh)'}
            </span>
            <button
              onClick={() => generate(true)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
              title="Download image"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setFullscreen(true)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-gray-400">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-cyan-500" />
              <Box className="w-6 h-6 text-cyan-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-lg font-medium text-gray-300">Generating Digital Twin...</p>
            <p className="text-sm text-gray-500">Creating a photorealistic 3D visualization of your substation</p>
            <p className="text-xs text-gray-600">This may take 15-30 seconds</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
              <Box className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 font-medium">Generation Failed</p>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              onClick={() => generate(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        ) : image ? (
          <img
            src={image}
            alt="Digital Twin - 3D Substation Visualization"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-cyan-500/10 cursor-pointer"
            onClick={() => setFullscreen(true)}
          />
        ) : !selectedProject ? (
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <Box className="w-16 h-16 text-gray-700" />
            <p className="text-lg font-medium">Select a project to generate its Digital Twin</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
