import { useState, useMemo } from 'react';
import { useSimulationContext } from './DemoSimulationContext';
import { 
  Search, Filter, Tag, Activity, Zap, Thermometer,
  Hash, Database, Clock, ArrowUpDown
} from 'lucide-react';

interface SCADATag {
  id: string;
  name: string;
  description: string;
  type: 'Analog' | 'Digital' | 'String';
  unit?: string;
  sourceDevice: string;
  equipment: string;
  currentValue: string | number;
  quality: 'Good' | 'Bad' | 'Uncertain';
  timestamp: Date;
  minValue?: number;
  maxValue?: number;
  deadband?: number;
}

const generateMockTags = (measurements: Record<string, number>, cbStates: Record<string, any>, isolatorStates: Record<string, boolean>): SCADATag[] => {
  const tags: SCADATag[] = [];
  
  // Voltage measurements
  tags.push({
    id: 'INC1_V',
    name: 'INC1.V',
    description: 'Incomer 1 Voltage',
    type: 'Analog',
    unit: 'kV',
    sourceDevice: 'RTU_001',
    equipment: 'Incomer 1',
    currentValue: measurements['INC1_V'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 28.0,
    maxValue: 38.0,
    deadband: 0.1
  });

  tags.push({
    id: 'TR1_V_HV',
    name: 'TR1.V.HV',
    description: 'Transformer 1 HV Voltage',
    type: 'Analog',
    unit: 'kV',
    sourceDevice: 'RTU_002',
    equipment: 'Transformer 1',
    currentValue: measurements['TR1_V_HV'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 28.0,
    maxValue: 38.0,
    deadband: 0.1
  });

  tags.push({
    id: 'TR1_V_LV',
    name: 'TR1.V.LV',
    description: 'Transformer 1 LV Voltage',
    type: 'Analog',
    unit: 'kV',
    sourceDevice: 'RTU_002',
    equipment: 'Transformer 1',
    currentValue: measurements['TR1_V_LV'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 9.0,
    maxValue: 12.0,
    deadband: 0.1
  });

  tags.push({
    id: 'TR2_V_HV',
    name: 'TR2.V.HV',
    description: 'Transformer 2 HV Voltage',
    type: 'Analog',
    unit: 'kV',
    sourceDevice: 'RTU_003',
    equipment: 'Transformer 2',
    currentValue: measurements['TR2_V_HV'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 28.0,
    maxValue: 38.0,
    deadband: 0.1
  });

  tags.push({
    id: 'TR2_V_LV',
    name: 'TR2.V.LV',
    description: 'Transformer 2 LV Voltage',
    type: 'Analog',
    unit: 'kV',
    sourceDevice: 'RTU_003',
    equipment: 'Transformer 2',
    currentValue: measurements['TR2_V_LV'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 9.0,
    maxValue: 12.0,
    deadband: 0.1
  });

  tags.push({
    id: 'BUS_11KV_V',
    name: 'BUS11KV.V',
    description: '11kV Bus Voltage',
    type: 'Analog',
    unit: 'kV',
    sourceDevice: 'RTU_004',
    equipment: '11kV Bus',
    currentValue: measurements['BUS_11KV_V'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 9.0,
    maxValue: 12.0,
    deadband: 0.1
  });

  // Current measurements
  tags.push({
    id: 'INC1_I',
    name: 'INC1.I',
    description: 'Incomer 1 Current',
    type: 'Analog',
    unit: 'A',
    sourceDevice: 'RTU_001',
    equipment: 'Incomer 1',
    currentValue: measurements['INC1_I'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 0,
    maxValue: 300,
    deadband: 1.0
  });

  tags.push({
    id: 'TR1_I_HV',
    name: 'TR1.I.HV',
    description: 'Transformer 1 HV Current',
    type: 'Analog',
    unit: 'A',
    sourceDevice: 'RTU_002',
    equipment: 'Transformer 1',
    currentValue: measurements['TR1_I_HV'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 0,
    maxValue: 300,
    deadband: 1.0
  });

  tags.push({
    id: 'TR2_I_HV',
    name: 'TR2.I.HV',
    description: 'Transformer 2 HV Current',
    type: 'Analog',
    unit: 'A',
    sourceDevice: 'RTU_003',
    equipment: 'Transformer 2',
    currentValue: measurements['TR2_I_HV'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 0,
    maxValue: 300,
    deadband: 1.0
  });

  // Power measurements
  tags.push({
    id: 'INC1_P',
    name: 'INC1.P',
    description: 'Incomer 1 Active Power',
    type: 'Analog',
    unit: 'MW',
    sourceDevice: 'RTU_001',
    equipment: 'Incomer 1',
    currentValue: measurements['INC1_P'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 0,
    maxValue: 12.0,
    deadband: 0.05
  });

  tags.push({
    id: 'TR1_P',
    name: 'TR1.P',
    description: 'Transformer 1 Active Power',
    type: 'Analog',
    unit: 'MW',
    sourceDevice: 'RTU_002',
    equipment: 'Transformer 1',
    currentValue: measurements['TR1_P'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 0,
    maxValue: 10.0,
    deadband: 0.05
  });

  tags.push({
    id: 'TR2_P',
    name: 'TR2.P',
    description: 'Transformer 2 Active Power',
    type: 'Analog',
    unit: 'MW',
    sourceDevice: 'RTU_003',
    equipment: 'Transformer 2',
    currentValue: measurements['TR2_P'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 0,
    maxValue: 10.0,
    deadband: 0.05
  });

  // Temperature measurements
  tags.push({
    id: 'TR1_OIL_TEMP',
    name: 'TR1.OIL.TEMP',
    description: 'Transformer 1 Oil Temperature',
    type: 'Analog',
    unit: '°C',
    sourceDevice: 'RTU_002',
    equipment: 'Transformer 1',
    currentValue: measurements['TR1_OIL_TEMP'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 20,
    maxValue: 90,
    deadband: 0.5
  });

  tags.push({
    id: 'TR2_OIL_TEMP',
    name: 'TR2.OIL.TEMP',
    description: 'Transformer 2 Oil Temperature',
    type: 'Analog',
    unit: '°C',
    sourceDevice: 'RTU_003',
    equipment: 'Transformer 2',
    currentValue: measurements['TR2_OIL_TEMP'] || 0,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 20,
    maxValue: 90,
    deadband: 0.5
  });

  // Feeder measurements
  for (let i = 1; i <= 6; i++) {
    const fdr = String(i).padStart(2, '0');
    
    tags.push({
      id: `FDR${fdr}_I`,
      name: `FDR${fdr}.I`,
      description: `Feeder ${i} Current`,
      type: 'Analog',
      unit: 'A',
      sourceDevice: 'RTU_004',
      equipment: `Feeder ${i}`,
      currentValue: measurements[`FDR${fdr}_I`] || 0,
      quality: 'Good',
      timestamp: new Date(),
      minValue: 0,
      maxValue: 250,
      deadband: 1.0
    });

    tags.push({
      id: `FDR${fdr}_P`,
      name: `FDR${fdr}.P`,
      description: `Feeder ${i} Active Power`,
      type: 'Analog',
      unit: 'MW',
      sourceDevice: 'RTU_004',
      equipment: `Feeder ${i}`,
      currentValue: measurements[`FDR${fdr}_P`] || 0,
      quality: 'Good',
      timestamp: new Date(),
      minValue: 0,
      maxValue: 3.0,
      deadband: 0.02
    });

    tags.push({
      id: `FDR${fdr}_V`,
      name: `FDR${fdr}.V`,
      description: `Feeder ${i} Voltage`,
      type: 'Analog',
      unit: 'kV',
      sourceDevice: 'RTU_004',
      equipment: `Feeder ${i}`,
      currentValue: measurements[`FDR${fdr}_V`] || 0,
      quality: 'Good',
      timestamp: new Date(),
      minValue: 9.0,
      maxValue: 12.0,
      deadband: 0.1
    });
  }

  // Digital tags for CB states
  Object.entries(cbStates).forEach(([cbId, state]) => {
    tags.push({
      id: `${cbId}_STATE`,
      name: `${cbId}.STATE`,
      description: `${cbId.replace('_', ' ')} Circuit Breaker State`,
      type: 'Digital',
      sourceDevice: getDeviceForCB(cbId),
      equipment: cbId.replace('_CB', '').replace('_', ' '),
      currentValue: state === 'CLOSED' ? 'CLOSED' : state === 'OPEN' ? 'OPEN' : 'TRIPPED',
      quality: 'Good',
      timestamp: new Date()
    });
  });

  // Digital tags for isolator states
  Object.entries(isolatorStates).forEach(([isoId, state]) => {
    tags.push({
      id: `${isoId}_STATE`,
      name: `${isoId}.STATE`,
      description: `${isoId.replace('_', ' ')} Isolator State`,
      type: 'Digital',
      sourceDevice: getDeviceForIsolator(isoId),
      equipment: isoId.replace('_ISO', '').replace('_', ' '),
      currentValue: state ? 'CLOSED' : 'OPEN',
      quality: 'Good',
      timestamp: new Date()
    });
  });

  // Frequency tags
  tags.push({
    id: 'SYS_FREQ',
    name: 'SYS.FREQ',
    description: 'System Frequency',
    type: 'Analog',
    unit: 'Hz',
    sourceDevice: 'RTU_001',
    equipment: 'System',
    currentValue: 50.02 + Math.random() * 0.06 - 0.03,
    quality: 'Good',
    timestamp: new Date(),
    minValue: 49.0,
    maxValue: 51.0,
    deadband: 0.01
  });

  // String tags
  tags.push({
    id: 'SYSTEM_STATUS',
    name: 'SYS.STATUS',
    description: 'System Status',
    type: 'String',
    sourceDevice: 'RTU_001',
    equipment: 'System',
    currentValue: 'NORMAL',
    quality: 'Good',
    timestamp: new Date()
  });

  tags.push({
    id: 'WEATHER_CONDITION',
    name: 'WEATHER.CONDITION',
    description: 'Weather Condition',
    type: 'String',
    sourceDevice: 'RTU_005',
    equipment: 'Weather Station',
    currentValue: 'CLEAR',
    quality: 'Good',
    timestamp: new Date()
  });

  return tags;
};

const getDeviceForCB = (cbId: string) => {
  if (cbId.includes('INC')) return 'RTU_001';
  if (cbId.includes('TR1')) return 'RTU_002';
  if (cbId.includes('TR2')) return 'RTU_003';
  if (cbId.includes('FDR') || cbId.includes('BC') || cbId.includes('BSC')) return 'RTU_004';
  return 'RTU_001';
};

const getDeviceForIsolator = (isoId: string) => {
  if (isoId.includes('INC')) return 'RTU_001';
  if (isoId.includes('TR1')) return 'RTU_002';
  if (isoId.includes('TR2')) return 'RTU_003';
  return 'RTU_001';
};

export default function DemoTagManagerPage() {
  const { measurements, cbStates, isolatorStates } = useSimulationContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Analog' | 'Digital' | 'String'>('All');
  const [filterEquipment, setFilterEquipment] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'equipment' | 'type' | 'value'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const allTags = useMemo(() => 
    generateMockTags(measurements, cbStates, isolatorStates),
    [measurements, cbStates, isolatorStates]
  );

  const equipmentList = useMemo(() => {
    const equipment = new Set(allTags.map(tag => tag.equipment));
    return ['All', ...Array.from(equipment).sort()];
  }, [allTags]);

  const filteredTags = useMemo(() => {
    let filtered = allTags.filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tag.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || tag.type === filterType;
      const matchesEquipment = filterEquipment === 'All' || tag.equipment === filterEquipment;
      
      return matchesSearch && matchesType && matchesEquipment;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'equipment':
          aVal = a.equipment;
          bVal = b.equipment;
          break;
        case 'type':
          aVal = a.type;
          bVal = b.type;
          break;
        case 'value':
          aVal = typeof a.currentValue === 'number' ? a.currentValue : a.currentValue.toString();
          bVal = typeof b.currentValue === 'number' ? b.currentValue : b.currentValue.toString();
          break;
        default:
          aVal = a.name;
          bVal = b.name;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      } else {
        const comparison = aVal.toString().localeCompare(bVal.toString());
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  }, [allTags, searchTerm, filterType, filterEquipment, sortBy, sortOrder]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Analog':
        return <Activity className="w-4 h-4 text-blue-600" />;
      case 'Digital':
        return <Hash className="w-4 h-4 text-green-600" />;
      case 'String':
        return <Database className="w-4 h-4 text-purple-600" />;
      default:
        return <Tag className="w-4 h-4 text-gray-600" />;
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Good':
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case 'Bad':
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      case 'Uncertain':
        return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500" />;
    }
  };

  const formatValue = (value: string | number, unit?: string) => {
    if (typeof value === 'number') {
      return `${value.toFixed(2)} ${unit || ''}`.trim();
    }
    return value.toString();
  };

  const handleSort = (field: 'name' | 'equipment' | 'type' | 'value') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tag Manager</h2>
          <p className="text-gray-600 mt-1">SCADA tag database and live values</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-blue-600" />
            {allTags.filter(t => t.type === 'Analog').length} Analog
          </div>
          <div className="flex items-center gap-1">
            <Hash className="w-4 h-4 text-green-600" />
            {allTags.filter(t => t.type === 'Digital').length} Digital
          </div>
          <div className="flex items-center gap-1">
            <Database className="w-4 h-4 text-purple-600" />
            {allTags.filter(t => t.type === 'String').length} String
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tags or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Analog">Analog</option>
              <option value="Digital">Digital</option>
              <option value="String">String</option>
            </select>
          </div>
          <div>
            <select
              value={filterEquipment}
              onChange={(e) => setFilterEquipment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {equipmentList.map(equipment => (
                <option key={equipment} value={equipment}>{equipment}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="w-4 h-4 mr-1" />
            {filteredTags.length} of {allTags.length} tags
          </div>
        </div>
      </div>

      {/* Tag Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Tag Name
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-1">
                    Type
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source Device</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('equipment')}
                >
                  <div className="flex items-center gap-1">
                    Equipment
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('value')}
                >
                  <div className="flex items-center gap-1">
                    Current Value
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTags.map(tag => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tag.type)}
                      <span className="font-mono text-sm font-medium">{tag.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tag.description}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      tag.type === 'Analog' 
                        ? 'bg-blue-100 text-blue-800'
                        : tag.type === 'Digital'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {tag.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tag.sourceDevice}</td>
                  <td className="px-6 py-4 text-sm font-medium">{tag.equipment}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-sm ${
                      tag.type === 'Digital' 
                        ? tag.currentValue === 'CLOSED' || tag.currentValue === 'NORMAL'
                          ? 'text-green-600 font-semibold'
                          : tag.currentValue === 'TRIPPED'
                          ? 'text-red-600 font-semibold'
                          : 'text-gray-600'
                        : 'text-gray-900'
                    }`}>
                      {formatValue(tag.currentValue, tag.unit)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getQualityIcon(tag.quality)}
                      <span className="text-sm">{tag.quality}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tag.timestamp.toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">{allTags.length}</div>
              <div className="text-sm text-gray-600">Total Tags</div>
            </div>
            <Tag className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">
                {allTags.filter(t => t.quality === 'Good').length}
              </div>
              <div className="text-sm text-gray-600">Good Quality</div>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-900">
                {allTags.filter(t => t.quality === 'Uncertain').length}
              </div>
              <div className="text-sm text-gray-600">Uncertain</div>
            </div>
            <Thermometer className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-900">
                {allTags.filter(t => t.quality === 'Bad').length}
              </div>
              <div className="text-sm text-gray-600">Bad Quality</div>
            </div>
            <Zap className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}