import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useRealtimeStore } from '@/stores/realtimeStore';
import {
  Maximize,
  Minimize,
  Pencil,
  ChevronLeft,
  Users,
} from 'lucide-react';

interface MimicElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  properties: {
    tagBinding?: string;
    label?: string;
    fontSize?: number;
    color?: string;
    animationRules?: { condition: string; property: string; value: string }[];
    text?: string;
    shapeType?: string;
    strokeWidth?: number;
    fill?: string;
    stroke?: string;
    [key: string]: any;
  };
}

interface MimicConnection {
  id: string;
  fromId: string;
  toId: string;
  points: { x: number; y: number }[];
  color: string;
  thickness: number;
}

interface PageData {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: MimicElement[];
  connections: MimicConnection[];
}

interface ProjectData {
  id: string;
  name: string;
  mimicPages: { id: string; name: string; pageOrder: number; isHomePage: boolean }[];
  userRole: string;
}

export default function MimicViewer() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [page, setPage] = useState<PageData | null>(null);
  const [activePageId, setActivePageId] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<MimicElement | null>(null);
  const values = useRealtimeStore((s) => s.values);

  useEffect(() => {
    if (!projectId) return;
    api.get(`/projects/${projectId}`).then(({ data }) => {
      setProject(data);
      const home = data.mimicPages?.find((p: any) => p.isHomePage) || data.mimicPages?.[0];
      if (home) setActivePageId(home.id);
    });
  }, [projectId]);

  useEffect(() => {
    if (!projectId || !activePageId) return;
    api.get(`/projects/${projectId}/pages/${activePageId}`).then(({ data }) => {
      setPage(data);
    });
  }, [projectId, activePageId]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Evaluate animation rules
  const getAnimatedStyle = (el: MimicElement): Record<string, string> => {
    const style: Record<string, string> = {};
    if (!el.properties.animationRules || !el.properties.tagBinding) return style;
    const tagValue = values[el.properties.tagBinding];
    if (tagValue === undefined) return style;
    const numValue = typeof tagValue === 'number' ? tagValue : parseFloat(String(tagValue));
    for (const rule of el.properties.animationRules) {
      try {
        const match = rule.condition.match(/^(>|<|>=|<=|==|!=)\s*(.+)$/);
        if (!match) continue;
        const [, op, threshold] = match;
        const thr = parseFloat(threshold);
        let result = false;
        if (op === '>' && numValue > thr) result = true;
        if (op === '<' && numValue < thr) result = true;
        if (op === '>=' && numValue >= thr) result = true;
        if (op === '<=' && numValue <= thr) result = true;
        if (op === '==' && numValue === thr) result = true;
        if (op === '!=' && numValue !== thr) result = true;
        if (result) {
          style[rule.property] = rule.value;
        }
      } catch {
        // ignore invalid rules
      }
    }
    return style;
  };

  const renderElement = (el: MimicElement) => {
    const animated = getAnimatedStyle(el);
    const tagValue = el.properties.tagBinding ? values[el.properties.tagBinding] : undefined;

    return (
      <g
        key={el.id}
        transform={`translate(${el.x}, ${el.y}) rotate(${el.rotation}, ${el.width / 2}, ${el.height / 2})`}
        onClick={(e) => {
          e.stopPropagation();
          if (el.type !== 'text' && el.type !== 'shape') setSelectedEquipment(el);
        }}
        style={{ cursor: el.type !== 'text' && el.type !== 'shape' ? 'pointer' : 'default' }}
      >
        {el.type === 'text' ? (
          <text
            x={0}
            y={el.properties.fontSize || 14}
            fontSize={el.properties.fontSize || 14}
            fill={animated.color || el.properties.color || '#000'}
            fontFamily="sans-serif"
          >
            {el.properties.text || 'Text'}
          </text>
        ) : el.type === 'shape' ? (
          el.properties.shapeType === 'circle' ? (
            <ellipse
              cx={el.width / 2}
              cy={el.height / 2}
              rx={el.width / 2}
              ry={el.height / 2}
              fill={animated.fill || el.properties.fill || '#E5E7EB'}
              stroke={animated.stroke || el.properties.stroke || '#6B7280'}
              strokeWidth={el.properties.strokeWidth || 2}
            />
          ) : el.properties.shapeType === 'line' ? (
            <line
              x1={0} y1={0} x2={el.width} y2={el.height}
              stroke={animated.stroke || el.properties.stroke || '#374151'}
              strokeWidth={el.properties.strokeWidth || 2}
            />
          ) : (
            <rect
              width={el.width}
              height={el.height}
              fill={animated.fill || el.properties.fill || '#E5E7EB'}
              stroke={animated.stroke || el.properties.stroke || '#6B7280'}
              strokeWidth={el.properties.strokeWidth || 2}
              rx={4}
            />
          )
        ) : el.type === 'value-display' ? (
          <g>
            <rect width={el.width} height={el.height} fill="#F0F9FF" stroke="#3B82F6" strokeWidth={1} rx={4} />
            <text x={el.width / 2} y={el.height / 2 + 5} textAnchor="middle" fontSize={12} fill="#1E40AF" fontFamily="monospace">
              {tagValue !== undefined ? String(tagValue) : '---'}
            </text>
          </g>
        ) : (
          <g>
            <rect
              width={el.width}
              height={el.height}
              fill={animated.fill || '#F8FAFC'}
              stroke={animated.stroke || animated.color || '#94A3B8'}
              strokeWidth={1.5}
              rx={4}
            />
            <text
              x={el.width / 2}
              y={el.height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.min(10, el.width / 6)}
              fill="#475569"
              fontFamily="sans-serif"
            >
              {el.type}
            </text>
            {el.properties.label && (
              <text x={el.width / 2} y={el.height + 14} textAnchor="middle" fontSize={10} fill="#64748B" fontFamily="sans-serif">
                {el.properties.label}
              </text>
            )}
            {tagValue !== undefined && (
              <text x={el.width / 2} y={-6} textAnchor="middle" fontSize={9} fill="#2563EB" fontFamily="monospace" fontWeight="bold">
                {String(tagValue)}
              </text>
            )}
          </g>
        )}
      </g>
    );
  };

  const canEdit = project && ['OWNER', 'ADMIN'].includes(project.userRole);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200 shrink-0">
        <button onClick={() => navigate('/app/projects')} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-gray-700">{project?.name}</span>

        {/* Page tabs */}
        <div className="flex gap-1 ml-4">
          {project?.mimicPages.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePageId(p.id)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                activePageId === p.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {canEdit && (
          <button
            onClick={() => navigate(`/app/projects/${projectId}/edit/${activePageId}`)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
        )}
        <button
          onClick={() => navigate(`/app/projects/${projectId}/members`)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
        >
          <Users className="w-4 h-4" /> Members
        </button>
        <button onClick={toggleFullscreen} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        {page ? (
          <svg
            viewBox={`0 0 ${page.width} ${page.height}`}
            className="max-w-full max-h-full shadow-lg rounded-lg"
            style={{ background: page.backgroundColor || '#FFFFFF' }}
            onClick={() => setSelectedEquipment(null)}
          >
            {/* Connections */}
            {(page.connections as MimicConnection[]).map((conn) => (
              <polyline
                key={conn.id}
                points={conn.points.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={conn.color || '#374151'}
                strokeWidth={conn.thickness || 2}
              />
            ))}

            {/* Elements */}
            {[...(page.elements as MimicElement[])]
              .sort((a, b) => a.zIndex - b.zIndex)
              .map(renderElement)}
          </svg>
        ) : (
          <div className="text-gray-400">Loading...</div>
        )}
      </div>

      {/* Equipment popup */}
      {selectedEquipment && (
        <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-72 z-10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">{selectedEquipment.properties.label || selectedEquipment.type}</h4>
            <button onClick={() => setSelectedEquipment(null)} className="text-gray-400 hover:text-gray-600 text-xs">Close</button>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-medium text-gray-700">{selectedEquipment.type}</span>
            </div>
            {selectedEquipment.properties.tagBinding && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tag</span>
                  <span className="font-mono text-gray-700">{selectedEquipment.properties.tagBinding}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Value</span>
                  <span className="font-mono font-bold text-blue-600">
                    {values[selectedEquipment.properties.tagBinding] !== undefined
                      ? String(values[selectedEquipment.properties.tagBinding])
                      : '---'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
