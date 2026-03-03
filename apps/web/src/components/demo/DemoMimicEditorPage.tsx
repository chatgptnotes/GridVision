import { useState, useRef, useCallback } from 'react';
import { 
  Move, RotateCw, Copy, Trash2, Layers, Grid, Save, 
  Undo2, Redo2, ZoomIn, ZoomOut, Eye, Settings,
  Square, Circle, Minus, Zap, Shield, Radio, Activity
} from 'lucide-react';

interface Equipment {
  id: string;
  type: 'busbar' | 'cb' | 'isolator' | 'transformer' | 'meter' | 'protection' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  label: string;
  properties: Record<string, any>;
}

const EQUIPMENT_PALETTE = [
  { 
    type: 'busbar', 
    label: 'Bus Bar', 
    icon: Minus, 
    description: 'Electrical bus bar',
    defaultWidth: 100,
    defaultHeight: 8,
    color: '#374151'
  },
  { 
    type: 'cb', 
    label: 'Circuit Breaker', 
    icon: Square, 
    description: 'Circuit breaker',
    defaultWidth: 24,
    defaultHeight: 24,
    color: '#3B82F6'
  },
  { 
    type: 'isolator', 
    label: 'Isolator', 
    icon: Circle, 
    description: 'Isolator/disconnect switch',
    defaultWidth: 20,
    defaultHeight: 20,
    color: '#6B7280'
  },
  { 
    type: 'transformer', 
    label: 'Transformer', 
    icon: Zap, 
    description: 'Power transformer',
    defaultWidth: 60,
    defaultHeight: 40,
    color: '#F59E0B'
  },
  { 
    type: 'meter', 
    label: 'Energy Meter', 
    icon: Activity, 
    description: 'Energy/power meter',
    defaultWidth: 30,
    defaultHeight: 30,
    color: '#10B981'
  },
  { 
    type: 'protection', 
    label: 'Protection Relay', 
    icon: Shield, 
    description: 'Protection relay',
    defaultWidth: 32,
    defaultHeight: 32,
    color: '#8B5CF6'
  },
  { 
    type: 'line', 
    label: 'Connection Line', 
    icon: Minus, 
    description: 'Electrical connection',
    defaultWidth: 2,
    defaultHeight: 50,
    color: '#374151'
  }
];

const SAMPLE_EQUIPMENT: Equipment[] = [
  {
    id: 'bus1',
    type: 'busbar',
    x: 50,
    y: 100,
    width: 300,
    height: 8,
    rotation: 0,
    label: '33kV Bus Section 1',
    properties: { voltage: 33, current: 0 }
  },
  {
    id: 'bus2',
    type: 'busbar',
    x: 450,
    y: 100,
    width: 300,
    height: 8,
    rotation: 0,
    label: '33kV Bus Section 2', 
    properties: { voltage: 33, current: 0 }
  },
  {
    id: 'inc1_cb',
    type: 'cb',
    x: 100,
    y: 50,
    width: 24,
    height: 24,
    rotation: 0,
    label: 'INC1 CB',
    properties: { state: 'CLOSED', rated: '1250A' }
  },
  {
    id: 'bsc_cb',
    type: 'cb',
    x: 375,
    y: 88,
    width: 24,
    height: 24,
    rotation: 0,
    label: 'BSC CB',
    properties: { state: 'CLOSED', rated: '1250A' }
  },
  {
    id: 'tr1',
    type: 'transformer',
    x: 150,
    y: 150,
    width: 60,
    height: 40,
    rotation: 0,
    label: 'TR1 (10MVA)',
    properties: { rating: '10MVA', ratio: '33/11kV' }
  },
  {
    id: 'tr2',
    type: 'transformer',
    x: 550,
    y: 150,
    width: 60,
    height: 40,
    rotation: 0,
    label: 'TR2 (10MVA)',
    properties: { rating: '10MVA', ratio: '33/11kV' }
  },
  {
    id: 'bus3',
    type: 'busbar',
    x: 50,
    y: 250,
    width: 300,
    height: 8,
    rotation: 0,
    label: '11kV Bus Section 1',
    properties: { voltage: 11, current: 0 }
  },
  {
    id: 'bus4',
    type: 'busbar',
    x: 450,
    y: 250,
    width: 300,
    height: 8,
    rotation: 0,
    label: '11kV Bus Section 2',
    properties: { voltage: 11, current: 0 }
  }
];

export default function DemoMimicEditorPage() {
  const [equipment, setEquipment] = useState<Equipment[]>(SAMPLE_EQUIPMENT);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showProperties, setShowProperties] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (type: string) => {
    setDraggedType(type);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const paletteItem = EQUIPMENT_PALETTE.find(item => item.type === draggedType);
    if (!paletteItem) return;

    const newEquipment: Equipment = {
      id: `${draggedType}_${Date.now()}`,
      type: draggedType as any,
      x: Math.max(0, x - paletteItem.defaultWidth / 2),
      y: Math.max(0, y - paletteItem.defaultHeight / 2),
      width: paletteItem.defaultWidth,
      height: paletteItem.defaultHeight,
      rotation: 0,
      label: `${paletteItem.label} ${equipment.filter(e => e.type === draggedType).length + 1}`,
      properties: {}
    };

    setEquipment(prev => [...prev, newEquipment]);
    setDraggedType(null);
  }, [draggedType, pan, zoom, equipment]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderEquipment = (eq: Equipment) => {
    const paletteItem = EQUIPMENT_PALETTE.find(item => item.type === eq.type);
    if (!paletteItem) return null;

    const isSelected = selectedEquipment?.id === eq.id;
    
    return (
      <g 
        key={eq.id}
        transform={`translate(${eq.x}, ${eq.y}) rotate(${eq.rotation}, ${eq.width/2}, ${eq.height/2})`}
        onClick={() => setSelectedEquipment(eq)}
        style={{ cursor: 'pointer' }}
      >
        {/* Equipment shape */}
        {eq.type === 'busbar' && (
          <rect
            width={eq.width}
            height={eq.height}
            fill={paletteItem.color}
            stroke={isSelected ? '#3B82F6' : 'none'}
            strokeWidth={isSelected ? 2 : 0}
          />
        )}
        {eq.type === 'cb' && (
          <g>
            <rect
              width={eq.width}
              height={eq.height}
              fill="white"
              stroke={paletteItem.color}
              strokeWidth={2}
              rx={2}
            />
            <line
              x1={4}
              y1={eq.height/2}
              x2={eq.width-4}
              y2={eq.height/2}
              stroke={paletteItem.color}
              strokeWidth={2}
            />
            {isSelected && (
              <rect
                width={eq.width + 4}
                height={eq.height + 4}
                x={-2}
                y={-2}
                fill="none"
                stroke="#3B82F6"
                strokeWidth={2}
                rx={4}
              />
            )}
          </g>
        )}
        {eq.type === 'isolator' && (
          <g>
            <circle
              cx={eq.width/2}
              cy={eq.height/2}
              r={eq.width/2}
              fill="white"
              stroke={paletteItem.color}
              strokeWidth={2}
            />
            <line
              x1={eq.width * 0.2}
              y1={eq.height/2}
              x2={eq.width * 0.8}
              y2={eq.height/2}
              stroke={paletteItem.color}
              strokeWidth={2}
            />
            {isSelected && (
              <circle
                cx={eq.width/2}
                cy={eq.height/2}
                r={eq.width/2 + 2}
                fill="none"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            )}
          </g>
        )}
        {eq.type === 'transformer' && (
          <g>
            <rect
              width={eq.width}
              height={eq.height}
              fill="white"
              stroke={paletteItem.color}
              strokeWidth={2}
              rx={4}
            />
            <circle
              cx={eq.width * 0.3}
              cy={eq.height/2}
              r={eq.width * 0.15}
              fill="none"
              stroke={paletteItem.color}
              strokeWidth={2}
            />
            <circle
              cx={eq.width * 0.7}
              cy={eq.height/2}
              r={eq.width * 0.15}
              fill="none"
              stroke={paletteItem.color}
              strokeWidth={2}
            />
            {isSelected && (
              <rect
                width={eq.width + 4}
                height={eq.height + 4}
                x={-2}
                y={-2}
                fill="none"
                stroke="#3B82F6"
                strokeWidth={2}
                rx={6}
              />
            )}
          </g>
        )}
        {eq.type === 'meter' && (
          <g>
            <circle
              cx={eq.width/2}
              cy={eq.height/2}
              r={eq.width/2}
              fill="white"
              stroke={paletteItem.color}
              strokeWidth={2}
            />
            <text
              x={eq.width/2}
              y={eq.height/2 + 2}
              textAnchor="middle"
              fontSize="8"
              fill={paletteItem.color}
            >
              M
            </text>
            {isSelected && (
              <circle
                cx={eq.width/2}
                cy={eq.height/2}
                r={eq.width/2 + 2}
                fill="none"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            )}
          </g>
        )}
        {eq.type === 'protection' && (
          <g>
            <rect
              width={eq.width}
              height={eq.height}
              fill="white"
              stroke={paletteItem.color}
              strokeWidth={2}
              rx={4}
            />
            <text
              x={eq.width/2}
              y={eq.height/2 + 3}
              textAnchor="middle"
              fontSize="10"
              fill={paletteItem.color}
              fontWeight="bold"
            >
              P
            </text>
            {isSelected && (
              <rect
                width={eq.width + 4}
                height={eq.height + 4}
                x={-2}
                y={-2}
                fill="none"
                stroke="#3B82F6"
                strokeWidth={2}
                rx={6}
              />
            )}
          </g>
        )}
        {eq.type === 'line' && (
          <g>
            <line
              x1={0}
              y1={eq.height/2}
              x2={eq.width}
              y2={eq.height/2}
              stroke={paletteItem.color}
              strokeWidth={eq.height}
            />
            {isSelected && (
              <line
                x1={0}
                y1={eq.height/2}
                x2={eq.width}
                y2={eq.height/2}
                stroke="#3B82F6"
                strokeWidth={eq.height + 4}
                opacity={0.3}
              />
            )}
          </g>
        )}
        
        {/* Label */}
        <text
          x={eq.width/2}
          y={eq.height + 12}
          textAnchor="middle"
          fontSize="10"
          fill="#374151"
          fontWeight="500"
        >
          {eq.label}
        </text>
      </g>
    );
  };

  const deleteSelectedEquipment = () => {
    if (selectedEquipment) {
      setEquipment(prev => prev.filter(eq => eq.id !== selectedEquipment.id));
      setSelectedEquipment(null);
    }
  };

  const rotateSelectedEquipment = () => {
    if (selectedEquipment) {
      setEquipment(prev => prev.map(eq => 
        eq.id === selectedEquipment.id 
          ? { ...eq, rotation: (eq.rotation + 90) % 360 }
          : eq
      ));
      setSelectedEquipment(prev => prev ? { ...prev, rotation: (prev.rotation + 90) % 360 } : null);
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Equipment Palette */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Equipment Palette
          </h3>
          <p className="text-sm text-gray-600 mt-1">Drag items to canvas</p>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {EQUIPMENT_PALETTE.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.type}
                  draggable
                  onDragStart={() => handleDragStart(item.type)}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors"
                >
                  <div 
                    className="p-2 rounded" 
                    style={{ backgroundColor: item.color + '20', color: item.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Undo2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Redo2 className="w-4 h-4" />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <button
              onClick={() => setZoom(prev => Math.min(prev * 1.2, 3))}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.3))}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 ml-2">{Math.round(zoom * 100)}%</span>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-colors ${
                showGrid ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {selectedEquipment && (
              <>
                <button
                  onClick={rotateSelectedEquipment}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={deleteSelectedEquipment}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowProperties(!showProperties)}
                  className={`p-2 rounded-lg transition-colors ${
                    showProperties ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>
                <div className="h-6 w-px bg-gray-200 mx-2" />
              </>
            )}
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4" />
              Save Diagram
            </button>
            <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full h-full cursor-move"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            <svg
              width="2000"
              height="1200"
              className="bg-white"
              onClick={() => setSelectedEquipment(null)}
            >
              {/* Grid */}
              {showGrid && (
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="1"/>
                  </pattern>
                </defs>
              )}
              {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}
              
              {/* Equipment */}
              {equipment.map(renderEquipment)}
              
              {/* Selection indicators */}
              {selectedEquipment && (
                <g transform={`translate(${selectedEquipment.x - 10}, ${selectedEquipment.y - 10})`}>
                  <circle cx="0" cy="0" r="3" fill="#3B82F6" />
                  <circle cx={selectedEquipment.width + 20} cy="0" r="3" fill="#3B82F6" />
                  <circle cx="0" cy={selectedEquipment.height + 20} r="3" fill="#3B82F6" />
                  <circle cx={selectedEquipment.width + 20} cy={selectedEquipment.height + 20} r="3" fill="#3B82F6" />
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {showProperties && selectedEquipment && (
        <div className="w-80 bg-white border-l border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Equipment Properties</h3>
            <p className="text-sm text-gray-600">{selectedEquipment.label}</p>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={selectedEquipment.label}
                onChange={(e) => {
                  const newLabel = e.target.value;
                  setSelectedEquipment(prev => prev ? { ...prev, label: newLabel } : null);
                  setEquipment(prev => prev.map(eq => 
                    eq.id === selectedEquipment.id ? { ...eq, label: newLabel } : eq
                  ));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">X Position</label>
                <input
                  type="number"
                  value={Math.round(selectedEquipment.x)}
                  onChange={(e) => {
                    const newX = parseInt(e.target.value) || 0;
                    setSelectedEquipment(prev => prev ? { ...prev, x: newX } : null);
                    setEquipment(prev => prev.map(eq => 
                      eq.id === selectedEquipment.id ? { ...eq, x: newX } : eq
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Y Position</label>
                <input
                  type="number"
                  value={Math.round(selectedEquipment.y)}
                  onChange={(e) => {
                    const newY = parseInt(e.target.value) || 0;
                    setSelectedEquipment(prev => prev ? { ...prev, y: newY } : null);
                    setEquipment(prev => prev.map(eq => 
                      eq.id === selectedEquipment.id ? { ...eq, y: newY } : eq
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                <input
                  type="number"
                  value={selectedEquipment.width}
                  onChange={(e) => {
                    const newWidth = parseInt(e.target.value) || 1;
                    setSelectedEquipment(prev => prev ? { ...prev, width: newWidth } : null);
                    setEquipment(prev => prev.map(eq => 
                      eq.id === selectedEquipment.id ? { ...eq, width: newWidth } : eq
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input
                  type="number"
                  value={selectedEquipment.height}
                  onChange={(e) => {
                    const newHeight = parseInt(e.target.value) || 1;
                    setSelectedEquipment(prev => prev ? { ...prev, height: newHeight } : null);
                    setEquipment(prev => prev.map(eq => 
                      eq.id === selectedEquipment.id ? { ...eq, height: newHeight } : eq
                    ));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
              <input
                type="number"
                step="90"
                min="0"
                max="270"
                value={selectedEquipment.rotation}
                onChange={(e) => {
                  const newRotation = parseInt(e.target.value) || 0;
                  setSelectedEquipment(prev => prev ? { ...prev, rotation: newRotation } : null);
                  setEquipment(prev => prev.map(eq => 
                    eq.id === selectedEquipment.id ? { ...eq, rotation: newRotation } : eq
                  ));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">Equipment Data Binding</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Tag: {selectedEquipment.id.toUpperCase()}</p>
                <p>Type: {selectedEquipment.type.toUpperCase()}</p>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Configure Data Tags
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Banner */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2">
        <div className="flex items-center gap-2 text-yellow-800 text-sm">
          <Eye className="w-4 h-4" />
          <span className="font-medium">Demo Mode:</span>
          <span>Drag-and-drop mimic editor preview</span>
        </div>
      </div>
    </div>
  );
}