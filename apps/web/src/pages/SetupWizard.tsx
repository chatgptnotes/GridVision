import { useState, useReducer, useCallback } from 'react';
import {
  Settings,
  Plus,
  Trash2,
  Edit,
  Check,
  ChevronRight,
  ChevronLeft,
  Play,
  Square,
  Loader,
  Upload,
  Zap,
  AlertTriangle,
  Server,
  Database,
  Cable,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TypeScript Interfaces                                              */
/* ------------------------------------------------------------------ */

interface SystemInfo {
  systemName: string;
  organization: string;
  adminEmail: string;
  adminPassword: string;
  adminPasswordConfirm: string;
}

interface Substation {
  id: string;
  name: string;
  code: string;
  type: '33/11kV' | '132/33kV' | '220/132kV';
  location: string;
  latitude: string;
  longitude: string;
}

type ProtocolType = 'Modbus TCP' | 'IEC 61850 (MMS)' | 'DNP3' | 'Simulator';

interface ModbusConfig {
  ipAddress: string;
  port: string;
  unitId: string;
  pollingInterval: string;
}

interface IEC61850Config {
  ipAddress: string;
  port: string;
  iedName: string;
  reportControlBlock: string;
}

interface DNP3Config {
  ipAddress: string;
  port: string;
  masterAddress: string;
  outstationAddress: string;
}

interface SimulatorConfig {
  numberOfTags: string;
  updateInterval: string;
}

type ProtocolConfig = ModbusConfig | IEC61850Config | DNP3Config | SimulatorConfig;

interface ProtocolConnection {
  id: string;
  substationId: string;
  protocol: ProtocolType;
  config: ProtocolConfig;
  testStatus: 'idle' | 'testing' | 'success' | 'fail';
}

type TagDataType = 'analog' | 'digital' | 'counter';
type EquipmentMapping =
  | 'Voltage'
  | 'Current'
  | 'Power'
  | 'Temperature'
  | 'CB Status'
  | 'Frequency'
  | 'Power Factor'
  | 'Energy'
  | 'Tap Position'
  | 'Other';

interface Tag {
  id: string;
  name: string;
  description: string;
  dataType: TagDataType;
  unit: string;
  scalingFactor: string;
  scalingOffset: string;
  equipmentMapping: EquipmentMapping;
  connectionId: string;
}

type AlarmPriority = 'Critical' | 'Major' | 'Minor' | 'Warning';

interface AlarmRule {
  id: string;
  tagId: string;
  highHigh: string;
  high: string;
  low: string;
  lowLow: string;
  deadband: string;
  priority: AlarmPriority;
}

interface WizardState {
  systemInfo: SystemInfo;
  substations: Substation[];
  connections: ProtocolConnection[];
  tags: Tag[];
  alarmRules: AlarmRule[];
  serverRunning: boolean;
  deployed: boolean;
}

type WizardAction =
  | { type: 'SET_SYSTEM_INFO'; payload: Partial<SystemInfo> }
  | { type: 'ADD_SUBSTATION'; payload: Substation }
  | { type: 'UPDATE_SUBSTATION'; payload: Substation }
  | { type: 'DELETE_SUBSTATION'; payload: string }
  | { type: 'ADD_CONNECTION'; payload: ProtocolConnection }
  | { type: 'UPDATE_CONNECTION'; payload: ProtocolConnection }
  | { type: 'DELETE_CONNECTION'; payload: string }
  | { type: 'SET_CONNECTION_TEST'; payload: { id: string; status: ProtocolConnection['testStatus'] } }
  | { type: 'ADD_TAG'; payload: Tag }
  | { type: 'ADD_TAGS'; payload: Tag[] }
  | { type: 'DELETE_TAG'; payload: string }
  | { type: 'ADD_ALARM_RULE'; payload: AlarmRule }
  | { type: 'ADD_ALARM_RULES'; payload: AlarmRule[] }
  | { type: 'DELETE_ALARM_RULE'; payload: string }
  | { type: 'SET_SERVER_RUNNING'; payload: boolean }
  | { type: 'SET_DEPLOYED'; payload: boolean };

const initialState: WizardState = {
  systemInfo: {
    systemName: '',
    organization: '',
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: '',
  },
  substations: [],
  connections: [],
  tags: [],
  alarmRules: [],
  serverRunning: false,
  deployed: false,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_SYSTEM_INFO':
      return { ...state, systemInfo: { ...state.systemInfo, ...action.payload } };
    case 'ADD_SUBSTATION':
      return { ...state, substations: [...state.substations, action.payload] };
    case 'UPDATE_SUBSTATION':
      return {
        ...state,
        substations: state.substations.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'DELETE_SUBSTATION':
      return { ...state, substations: state.substations.filter((s) => s.id !== action.payload) };
    case 'ADD_CONNECTION':
      return { ...state, connections: [...state.connections, action.payload] };
    case 'UPDATE_CONNECTION':
      return {
        ...state,
        connections: state.connections.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CONNECTION':
      return { ...state, connections: state.connections.filter((c) => c.id !== action.payload) };
    case 'SET_CONNECTION_TEST':
      return {
        ...state,
        connections: state.connections.map((c) =>
          c.id === action.payload.id ? { ...c, testStatus: action.payload.status } : c
        ),
      };
    case 'ADD_TAG':
      return { ...state, tags: [...state.tags, action.payload] };
    case 'ADD_TAGS':
      return { ...state, tags: [...state.tags, ...action.payload] };
    case 'DELETE_TAG':
      return { ...state, tags: state.tags.filter((t) => t.id !== action.payload) };
    case 'ADD_ALARM_RULE':
      return { ...state, alarmRules: [...state.alarmRules, action.payload] };
    case 'ADD_ALARM_RULES':
      return { ...state, alarmRules: [...state.alarmRules, ...action.payload] };
    case 'DELETE_ALARM_RULE':
      return { ...state, alarmRules: state.alarmRules.filter((r) => r.id !== action.payload) };
    case 'SET_SERVER_RUNNING':
      return { ...state, serverRunning: action.payload };
    case 'SET_DEPLOYED':
      return { ...state, deployed: action.payload };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STEPS = [
  'System Info',
  'Substations',
  'Protocols',
  'Tag Mapping',
  'Alarms',
  'Review & Deploy',
] as const;

const SUBSTATION_TYPES: Substation['type'][] = ['33/11kV', '132/33kV', '220/132kV'];
const PROTOCOL_TYPES: ProtocolType[] = ['Modbus TCP', 'IEC 61850 (MMS)', 'DNP3', 'Simulator'];
const TAG_DATA_TYPES: TagDataType[] = ['analog', 'digital', 'counter'];
const EQUIPMENT_MAPPINGS: EquipmentMapping[] = [
  'Voltage',
  'Current',
  'Power',
  'Temperature',
  'CB Status',
  'Frequency',
  'Power Factor',
  'Energy',
  'Tap Position',
  'Other',
];
const ALARM_PRIORITIES: AlarmPriority[] = ['Critical', 'Major', 'Minor', 'Warning'];

const uid = () => Math.random().toString(36).slice(2, 11);

/* ------------------------------------------------------------------ */
/*  Reusable small components                                          */
/* ------------------------------------------------------------------ */

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
    />
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function BtnPrimary({
  children,
  onClick,
  disabled = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function BtnSecondary({
  children,
  onClick,
  disabled = false,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function BtnDanger({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
}

function Card({ children, title, icon }: { children: React.ReactNode; title?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {title && (
        <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-3">
          {icon}
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step Indicator                                                     */
/* ------------------------------------------------------------------ */

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <nav className="mb-8">
      <ol className="flex items-center w-full">
        {STEPS.map((label, idx) => {
          const isComplete = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <li
              key={label}
              className={`flex items-center ${idx < STEPS.length - 1 ? 'flex-1' : ''}`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    isComplete
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : isCurrent
                        ? 'border-blue-600 bg-white text-blue-600'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                    isCurrent ? 'text-blue-600' : isComplete ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`mx-2 mt-[-1rem] h-0.5 flex-1 ${
                    idx < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1: System Info                                                */
/* ------------------------------------------------------------------ */

function StepSystemInfo({
  systemInfo,
  dispatch,
}: {
  systemInfo: SystemInfo;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const set = (field: keyof SystemInfo) => (v: string) =>
    dispatch({ type: 'SET_SYSTEM_INFO', payload: { [field]: v } });

  return (
    <Card title="System Information" icon={<Settings className="h-5 w-5 text-blue-600" />}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label>System Name</Label>
          <Input
            value={systemInfo.systemName}
            onChange={set('systemName')}
            placeholder="e.g. MSEDCL Nagpur Division"
          />
        </div>
        <div>
          <Label>Organization</Label>
          <Input
            value={systemInfo.organization}
            onChange={set('organization')}
            placeholder="e.g. Maharashtra State Electricity Distribution Co."
          />
        </div>
        <div>
          <Label>Admin Email</Label>
          <Input
            value={systemInfo.adminEmail}
            onChange={set('adminEmail')}
            placeholder="admin@example.com"
            type="email"
          />
        </div>
        <div>{/* spacer for grid alignment */}</div>
        <div>
          <Label>Admin Password</Label>
          <Input
            value={systemInfo.adminPassword}
            onChange={set('adminPassword')}
            placeholder="Minimum 8 characters"
            type="password"
          />
        </div>
        <div>
          <Label>Confirm Password</Label>
          <Input
            value={systemInfo.adminPasswordConfirm}
            onChange={set('adminPasswordConfirm')}
            placeholder="Re-enter password"
            type="password"
          />
          {systemInfo.adminPassword &&
            systemInfo.adminPasswordConfirm &&
            systemInfo.adminPassword !== systemInfo.adminPasswordConfirm && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
            )}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: Add Substations                                            */
/* ------------------------------------------------------------------ */

const emptySubstation = (): Substation => ({
  id: uid(),
  name: '',
  code: '',
  type: '33/11kV',
  location: '',
  latitude: '',
  longitude: '',
});

function StepSubstations({
  substations,
  dispatch,
}: {
  substations: Substation[];
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Substation>(emptySubstation());

  const resetForm = () => {
    setForm(emptySubstation());
    setShowForm(false);
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) return;
    if (editId) {
      dispatch({ type: 'UPDATE_SUBSTATION', payload: form });
    } else {
      dispatch({ type: 'ADD_SUBSTATION', payload: form });
    }
    resetForm();
  };

  const handleEdit = (ss: Substation) => {
    setForm(ss);
    setEditId(ss.id);
    setShowForm(true);
  };

  return (
    <Card title="Substations" icon={<Zap className="h-5 w-5 text-blue-600" />}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {substations.length} substation{substations.length !== 1 ? 's' : ''} configured
        </p>
        {!showForm && (
          <BtnPrimary onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Substation
          </BtnPrimary>
        )}
      </div>

      {showForm && (
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-800">
            {editId ? 'Edit Substation' : 'New Substation'}
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="e.g. Ambazari 33/11kV"
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input
                value={form.code}
                onChange={(v) => setForm({ ...form, code: v })}
                placeholder="e.g. AMB-33"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={form.type}
                onChange={(v) => setForm({ ...form, type: v })}
                options={SUBSTATION_TYPES}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(v) => setForm({ ...form, location: v })}
                placeholder="e.g. Nagpur, Maharashtra"
              />
            </div>
            <div>
              <Label>Latitude</Label>
              <Input
                value={form.latitude}
                onChange={(v) => setForm({ ...form, latitude: v })}
                placeholder="e.g. 21.1458"
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                value={form.longitude}
                onChange={(v) => setForm({ ...form, longitude: v })}
                placeholder="e.g. 79.0882"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <BtnPrimary onClick={handleSave}>
              <Check className="h-4 w-4" />
              {editId ? 'Update' : 'Save'}
            </BtnPrimary>
            <BtnSecondary onClick={resetForm}>Cancel</BtnSecondary>
          </div>
        </div>
      )}

      {substations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Lat/Long</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {substations.map((ss, i) => (
                <tr
                  key={ss.id}
                  className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-3 py-2 font-medium text-gray-900">{ss.name}</td>
                  <td className="px-3 py-2 text-gray-600">{ss.code}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {ss.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600">{ss.location}</td>
                  <td className="px-3 py-2 text-gray-500 text-xs">
                    {ss.latitude && ss.longitude ? `${ss.latitude}, ${ss.longitude}` : '-'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(ss)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'DELETE_SUBSTATION', payload: ss.id })}
                        className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {substations.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Zap className="mb-2 h-10 w-10" />
          <p className="text-sm">No substations added yet. Click "Add Substation" to begin.</p>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: Configure Protocol Connections                             */
/* ------------------------------------------------------------------ */

function defaultConfig(protocol: ProtocolType): ProtocolConfig {
  switch (protocol) {
    case 'Modbus TCP':
      return { ipAddress: '', port: '502', unitId: '1', pollingInterval: '1000' };
    case 'IEC 61850 (MMS)':
      return { ipAddress: '', port: '102', iedName: '', reportControlBlock: '' };
    case 'DNP3':
      return { ipAddress: '', port: '20000', masterAddress: '1', outstationAddress: '2' };
    case 'Simulator':
      return { numberOfTags: '20', updateInterval: '1000' };
  }
}

function emptyConnection(substationId: string): ProtocolConnection {
  return {
    id: uid(),
    substationId,
    protocol: 'Modbus TCP',
    config: defaultConfig('Modbus TCP'),
    testStatus: 'idle',
  };
}

function ProtocolConfigFields({
  protocol,
  config,
  setConfig,
}: {
  protocol: ProtocolType;
  config: ProtocolConfig;
  setConfig: (c: ProtocolConfig) => void;
}) {
  const set = (field: string) => (v: string) => setConfig({ ...config, [field]: v });

  switch (protocol) {
    case 'Modbus TCP': {
      const c = config as ModbusConfig;
      return (
        <>
          <div>
            <Label>IP Address</Label>
            <Input value={c.ipAddress} onChange={set('ipAddress')} placeholder="192.168.1.100" />
          </div>
          <div>
            <Label>Port</Label>
            <Input value={c.port} onChange={set('port')} placeholder="502" />
          </div>
          <div>
            <Label>Unit ID</Label>
            <Input value={c.unitId} onChange={set('unitId')} placeholder="1" />
          </div>
          <div>
            <Label>Polling Interval (ms)</Label>
            <Input value={c.pollingInterval} onChange={set('pollingInterval')} placeholder="1000" />
          </div>
        </>
      );
    }
    case 'IEC 61850 (MMS)': {
      const c = config as IEC61850Config;
      return (
        <>
          <div>
            <Label>IP Address</Label>
            <Input value={c.ipAddress} onChange={set('ipAddress')} placeholder="192.168.1.100" />
          </div>
          <div>
            <Label>Port</Label>
            <Input value={c.port} onChange={set('port')} placeholder="102" />
          </div>
          <div>
            <Label>IED Name</Label>
            <Input value={c.iedName} onChange={set('iedName')} placeholder="e.g. REL670" />
          </div>
          <div>
            <Label>Report Control Block</Label>
            <Input
              value={c.reportControlBlock}
              onChange={set('reportControlBlock')}
              placeholder="e.g. brcbMEAS01"
            />
          </div>
        </>
      );
    }
    case 'DNP3': {
      const c = config as DNP3Config;
      return (
        <>
          <div>
            <Label>IP Address</Label>
            <Input value={c.ipAddress} onChange={set('ipAddress')} placeholder="192.168.1.100" />
          </div>
          <div>
            <Label>Port</Label>
            <Input value={c.port} onChange={set('port')} placeholder="20000" />
          </div>
          <div>
            <Label>Master Address</Label>
            <Input value={c.masterAddress} onChange={set('masterAddress')} placeholder="1" />
          </div>
          <div>
            <Label>Outstation Address</Label>
            <Input
              value={c.outstationAddress}
              onChange={set('outstationAddress')}
              placeholder="2"
            />
          </div>
        </>
      );
    }
    case 'Simulator': {
      const c = config as SimulatorConfig;
      return (
        <>
          <div>
            <Label>Number of Tags</Label>
            <Input value={c.numberOfTags} onChange={set('numberOfTags')} placeholder="20" />
          </div>
          <div>
            <Label>Update Interval (ms)</Label>
            <Input value={c.updateInterval} onChange={set('updateInterval')} placeholder="1000" />
          </div>
        </>
      );
    }
  }
}

function StepProtocols({
  substations,
  connections,
  dispatch,
}: {
  substations: Substation[];
  connections: ProtocolConnection[];
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProtocolConnection>(
    emptyConnection(substations[0]?.id || '')
  );

  const resetForm = () => {
    setForm(emptyConnection(substations[0]?.id || ''));
    setShowForm(false);
  };

  const handleProtocolChange = (protocol: ProtocolType) => {
    setForm({ ...form, protocol, config: defaultConfig(protocol) });
  };

  const handleSave = () => {
    dispatch({ type: 'ADD_CONNECTION', payload: { ...form, id: uid() } });
    resetForm();
  };

  const handleTestConnection = useCallback(
    (connId: string) => {
      dispatch({ type: 'SET_CONNECTION_TEST', payload: { id: connId, status: 'testing' } });
      setTimeout(() => {
        const success = Math.random() > 0.3;
        dispatch({
          type: 'SET_CONNECTION_TEST',
          payload: { id: connId, status: success ? 'success' : 'fail' },
        });
      }, 1500);
    },
    [dispatch]
  );

  const ssName = (id: string) => substations.find((s) => s.id === id)?.name || 'Unknown';

  return (
    <Card title="Protocol Connections" icon={<Cable className="h-5 w-5 text-blue-600" />}>
      {substations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <AlertTriangle className="mb-2 h-10 w-10" />
          <p className="text-sm">Add at least one substation in Step 2 first.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {connections.length} connection{connections.length !== 1 ? 's' : ''} configured
            </p>
            {!showForm && (
              <BtnPrimary onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" />
                Add Connection
              </BtnPrimary>
            )}
          </div>

          {showForm && (
            <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-800">New Connection</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label>Substation</Label>
                  <select
                    value={form.substationId}
                    onChange={(e) => setForm({ ...form, substationId: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {substations.map((ss) => (
                      <option key={ss.id} value={ss.id}>
                        {ss.name} ({ss.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Protocol Type</Label>
                  <Select
                    value={form.protocol}
                    onChange={handleProtocolChange}
                    options={PROTOCOL_TYPES}
                  />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ProtocolConfigFields
                  protocol={form.protocol}
                  config={form.config}
                  setConfig={(c) => setForm({ ...form, config: c })}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <BtnPrimary onClick={handleSave}>
                  <Check className="h-4 w-4" />
                  Save
                </BtnPrimary>
                <BtnSecondary onClick={resetForm}>Cancel</BtnSecondary>
              </div>
            </div>
          )}

          {connections.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-2">Substation</th>
                    <th className="px-3 py-2">Protocol</th>
                    <th className="px-3 py-2">Details</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {connections.map((conn, i) => {
                    const details = connectionSummary(conn);
                    return (
                      <tr
                        key={conn.id}
                        className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-3 py-2 font-medium text-gray-900">
                          {ssName(conn.substationId)}
                        </td>
                        <td className="px-3 py-2">
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                            {conn.protocol}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-600 text-xs">{details}</td>
                        <td className="px-3 py-2">
                          <ConnectionStatusBadge status={conn.testStatus} />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleTestConnection(conn.id)}
                              disabled={conn.testStatus === 'testing'}
                              className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                              title="Test Connection"
                            >
                              {conn.testStatus === 'testing' ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                'Test'
                              )}
                            </button>
                            <button
                              onClick={() =>
                                dispatch({ type: 'DELETE_CONNECTION', payload: conn.id })
                              }
                              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {connections.length === 0 && !showForm && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Cable className="mb-2 h-10 w-10" />
              <p className="text-sm">
                No connections configured. Click "Add Connection" to begin.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function connectionSummary(conn: ProtocolConnection): string {
  const c = conn.config;
  switch (conn.protocol) {
    case 'Modbus TCP': {
      const mc = c as ModbusConfig;
      return `${mc.ipAddress || '?'}:${mc.port} / Unit ${mc.unitId} / ${mc.pollingInterval}ms`;
    }
    case 'IEC 61850 (MMS)': {
      const ic = c as IEC61850Config;
      return `${ic.ipAddress || '?'}:${ic.port} / ${ic.iedName || '?'} / ${ic.reportControlBlock || '?'}`;
    }
    case 'DNP3': {
      const dc = c as DNP3Config;
      return `${dc.ipAddress || '?'}:${dc.port} / M:${dc.masterAddress} O:${dc.outstationAddress}`;
    }
    case 'Simulator': {
      const sc = c as SimulatorConfig;
      return `${sc.numberOfTags} tags / ${sc.updateInterval}ms`;
    }
  }
}

function ConnectionStatusBadge({ status }: { status: ProtocolConnection['testStatus'] }) {
  switch (status) {
    case 'idle':
      return <span className="text-xs text-gray-400">Not tested</span>;
    case 'testing':
      return (
        <span className="inline-flex items-center gap-1 text-xs text-blue-600">
          <Loader className="h-3 w-3 animate-spin" />
          Testing...
        </span>
      );
    case 'success':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          <Check className="h-3 w-3" />
          Connected
        </span>
      );
    case 'fail':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          <AlertTriangle className="h-3 w-3" />
          Failed
        </span>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Step 4: Tag Mapping                                                */
/* ------------------------------------------------------------------ */

function emptyTag(connectionId: string): Tag {
  return {
    id: uid(),
    name: '',
    description: '',
    dataType: 'analog',
    unit: '',
    scalingFactor: '1',
    scalingOffset: '0',
    equipmentMapping: 'Voltage',
    connectionId,
  };
}

function generateSampleTags(connections: ProtocolConnection[], substations: Substation[]): Tag[] {
  const tags: Tag[] = [];
  const templates: Array<{
    suffix: string;
    desc: string;
    dataType: TagDataType;
    unit: string;
    mapping: EquipmentMapping;
  }> = [
    { suffix: 'V_R', desc: 'R-Phase Voltage', dataType: 'analog', unit: 'kV', mapping: 'Voltage' },
    { suffix: 'V_Y', desc: 'Y-Phase Voltage', dataType: 'analog', unit: 'kV', mapping: 'Voltage' },
    { suffix: 'V_B', desc: 'B-Phase Voltage', dataType: 'analog', unit: 'kV', mapping: 'Voltage' },
    { suffix: 'I_R', desc: 'R-Phase Current', dataType: 'analog', unit: 'A', mapping: 'Current' },
    { suffix: 'I_Y', desc: 'Y-Phase Current', dataType: 'analog', unit: 'A', mapping: 'Current' },
    { suffix: 'I_B', desc: 'B-Phase Current', dataType: 'analog', unit: 'A', mapping: 'Current' },
    { suffix: 'P', desc: 'Active Power', dataType: 'analog', unit: 'MW', mapping: 'Power' },
    { suffix: 'Q', desc: 'Reactive Power', dataType: 'analog', unit: 'MVAR', mapping: 'Power' },
    { suffix: 'F', desc: 'Frequency', dataType: 'analog', unit: 'Hz', mapping: 'Frequency' },
    { suffix: 'PF', desc: 'Power Factor', dataType: 'analog', unit: '', mapping: 'Power Factor' },
    { suffix: 'TEMP', desc: 'Transformer Temperature', dataType: 'analog', unit: 'degC', mapping: 'Temperature' },
    { suffix: 'CB1', desc: 'Incomer CB Status', dataType: 'digital', unit: '', mapping: 'CB Status' },
    { suffix: 'CB2', desc: 'Feeder 1 CB Status', dataType: 'digital', unit: '', mapping: 'CB Status' },
    { suffix: 'kWh', desc: 'Energy Counter', dataType: 'counter', unit: 'MWh', mapping: 'Energy' },
  ];

  connections.forEach((conn) => {
    const ss = substations.find((s) => s.id === conn.substationId);
    const prefix = ss ? ss.code : 'UNK';
    templates.forEach((t) => {
      tags.push({
        id: uid(),
        name: `${prefix}_${t.suffix}`,
        description: `${ss?.name || 'Unknown'} - ${t.desc}`,
        dataType: t.dataType,
        unit: t.unit,
        scalingFactor: '1',
        scalingOffset: '0',
        equipmentMapping: t.mapping,
        connectionId: conn.id,
      });
    });
  });

  return tags;
}

function StepTagMapping({
  connections,
  substations,
  tags,
  dispatch,
}: {
  connections: ProtocolConnection[];
  substations: Substation[];
  tags: Tag[];
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Tag>(emptyTag(connections[0]?.id || ''));
  const [discovering, setDiscovering] = useState(false);

  const handleAutoDiscover = () => {
    setDiscovering(true);
    setTimeout(() => {
      const sampleTags = generateSampleTags(connections, substations);
      dispatch({ type: 'ADD_TAGS', payload: sampleTags });
      setDiscovering(false);
    }, 2000);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    dispatch({ type: 'ADD_TAG', payload: { ...form, id: uid() } });
    setForm(emptyTag(connections[0]?.id || ''));
    setShowForm(false);
  };

  const connLabel = (id: string) => {
    const conn = connections.find((c) => c.id === id);
    if (!conn) return 'Unknown';
    const ss = substations.find((s) => s.id === conn.substationId);
    return `${ss?.code || '?'} / ${conn.protocol}`;
  };

  return (
    <Card title="Tag Mapping" icon={<Database className="h-5 w-5 text-blue-600" />}>
      {connections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <AlertTriangle className="mb-2 h-10 w-10" />
          <p className="text-sm">Add at least one protocol connection in Step 3 first.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <BtnPrimary onClick={handleAutoDiscover} disabled={discovering || connections.length === 0}>
              {discovering ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {discovering ? 'Discovering...' : 'Auto-Discover Tags'}
            </BtnPrimary>
            {!showForm && (
              <BtnSecondary onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" />
                Add Tag Manually
              </BtnSecondary>
            )}
            <BtnSecondary onClick={() => {}} disabled>
              <Upload className="h-4 w-4" />
              Import from CSV
            </BtnSecondary>
            <span className="ml-auto text-sm text-gray-500">
              {tags.length} tag{tags.length !== 1 ? 's' : ''} mapped
            </span>
          </div>

          {showForm && (
            <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-800">Add Tag</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label>Connection</Label>
                  <select
                    value={form.connectionId}
                    onChange={(e) => setForm({ ...form, connectionId: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {connections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {connLabel(c.id)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Tag Name</Label>
                  <Input
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="e.g. AMB_V_R"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={form.description}
                    onChange={(v) => setForm({ ...form, description: v })}
                    placeholder="e.g. R-Phase Voltage"
                  />
                </div>
                <div>
                  <Label>Data Type</Label>
                  <Select
                    value={form.dataType}
                    onChange={(v) => setForm({ ...form, dataType: v })}
                    options={TAG_DATA_TYPES}
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input
                    value={form.unit}
                    onChange={(v) => setForm({ ...form, unit: v })}
                    placeholder="e.g. kV, A, MW"
                  />
                </div>
                <div>
                  <Label>Equipment Mapping</Label>
                  <Select
                    value={form.equipmentMapping}
                    onChange={(v) => setForm({ ...form, equipmentMapping: v })}
                    options={EQUIPMENT_MAPPINGS}
                  />
                </div>
                <div>
                  <Label>Scaling Factor</Label>
                  <Input
                    value={form.scalingFactor}
                    onChange={(v) => setForm({ ...form, scalingFactor: v })}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label>Scaling Offset</Label>
                  <Input
                    value={form.scalingOffset}
                    onChange={(v) => setForm({ ...form, scalingOffset: v })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <BtnPrimary onClick={handleSave}>
                  <Check className="h-4 w-4" />
                  Save Tag
                </BtnPrimary>
                <BtnSecondary onClick={() => setShowForm(false)}>Cancel</BtnSecondary>
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2">Mapping</th>
                    <th className="px-3 py-2">Scaling</th>
                    <th className="px-3 py-2">Connection</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag, i) => (
                    <tr
                      key={tag.id}
                      className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {tag.name}
                      </td>
                      <td className="px-3 py-2 text-gray-600 text-xs max-w-[200px] truncate">
                        {tag.description}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            tag.dataType === 'analog'
                              ? 'bg-green-100 text-green-700'
                              : tag.dataType === 'digital'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {tag.dataType}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{tag.unit || '-'}</td>
                      <td className="px-3 py-2 text-gray-600 text-xs">{tag.equipmentMapping}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">
                        {tag.scalingFactor}x + {tag.scalingOffset}
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">
                        {connLabel(tag.connectionId)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => dispatch({ type: 'DELETE_TAG', payload: tag.id })}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tags.length === 0 && !showForm && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Database className="mb-2 h-10 w-10" />
              <p className="text-sm">
                No tags mapped yet. Use "Auto-Discover" or add tags manually.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 5: Alarm Configuration                                        */
/* ------------------------------------------------------------------ */

function emptyAlarmRule(tagId: string): AlarmRule {
  return {
    id: uid(),
    tagId,
    highHigh: '',
    high: '',
    low: '',
    lowLow: '',
    deadband: '0.5',
    priority: 'Major',
  };
}

interface AlarmTemplate {
  label: string;
  rules: Array<{
    mappingFilter: EquipmentMapping;
    highHigh: string;
    high: string;
    low: string;
    lowLow: string;
    deadband: string;
    priority: AlarmPriority;
  }>;
}

const ALARM_TEMPLATES: AlarmTemplate[] = [
  {
    label: 'Standard 33/11kV Substation',
    rules: [
      { mappingFilter: 'Voltage', highHigh: '36.3', high: '34.65', low: '29.7', lowLow: '28.05', deadband: '0.2', priority: 'Critical' },
      { mappingFilter: 'Current', highHigh: '650', high: '600', low: '0', lowLow: '0', deadband: '5', priority: 'Major' },
      { mappingFilter: 'Power', highHigh: '25', high: '22', low: '-1', lowLow: '-5', deadband: '0.5', priority: 'Major' },
      { mappingFilter: 'Frequency', highHigh: '51.5', high: '50.5', low: '49.5', lowLow: '48.5', deadband: '0.1', priority: 'Critical' },
      { mappingFilter: 'Temperature', highHigh: '95', high: '85', low: '0', lowLow: '-10', deadband: '1', priority: 'Major' },
    ],
  },
];

function StepAlarms({
  tags,
  alarmRules,
  dispatch,
}: {
  tags: Tag[];
  alarmRules: AlarmRule[];
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [showForm, setShowForm] = useState(false);
  const analogTags = tags.filter((t) => t.dataType === 'analog');
  const [form, setForm] = useState<AlarmRule>(emptyAlarmRule(analogTags[0]?.id || ''));

  const handleSave = () => {
    if (!form.tagId) return;
    dispatch({ type: 'ADD_ALARM_RULE', payload: { ...form, id: uid() } });
    setForm(emptyAlarmRule(analogTags[0]?.id || ''));
    setShowForm(false);
  };

  const handleApplyTemplate = (template: AlarmTemplate) => {
    const newRules: AlarmRule[] = [];
    template.rules.forEach((rule) => {
      const matchingTags = tags.filter(
        (t) => t.dataType === 'analog' && t.equipmentMapping === rule.mappingFilter
      );
      matchingTags.forEach((tag) => {
        const alreadyExists = alarmRules.some((ar) => ar.tagId === tag.id);
        if (!alreadyExists) {
          newRules.push({
            id: uid(),
            tagId: tag.id,
            highHigh: rule.highHigh,
            high: rule.high,
            low: rule.low,
            lowLow: rule.lowLow,
            deadband: rule.deadband,
            priority: rule.priority,
          });
        }
      });
    });
    if (newRules.length > 0) {
      dispatch({ type: 'ADD_ALARM_RULES', payload: newRules });
    }
  };

  const tagName = (id: string) => tags.find((t) => t.id === id)?.name || 'Unknown';

  return (
    <Card title="Alarm Configuration" icon={<AlertTriangle className="h-5 w-5 text-blue-600" />}>
      {analogTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <AlertTriangle className="mb-2 h-10 w-10" />
          <p className="text-sm">No analog tags available. Map tags in Step 4 first.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {!showForm && (
              <BtnPrimary onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" />
                Add Alarm Rule
              </BtnPrimary>
            )}
            {ALARM_TEMPLATES.map((t) => (
              <BtnSecondary key={t.label} onClick={() => handleApplyTemplate(t)}>
                <Zap className="h-4 w-4" />
                {t.label}
              </BtnSecondary>
            ))}
            <span className="ml-auto text-sm text-gray-500">
              {alarmRules.length} rule{alarmRules.length !== 1 ? 's' : ''} configured
            </span>
          </div>

          {showForm && (
            <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
              <h4 className="mb-3 text-sm font-semibold text-gray-800">New Alarm Rule</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                  <Label>Tag</Label>
                  <select
                    value={form.tagId}
                    onChange={(e) => setForm({ ...form, tagId: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Select a tag...
                    </option>
                    {analogTags.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.unit || 'no unit'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={form.priority}
                    onChange={(v) => setForm({ ...form, priority: v })}
                    options={ALARM_PRIORITIES}
                  />
                </div>
                <div>
                  <Label>Deadband</Label>
                  <Input
                    value={form.deadband}
                    onChange={(v) => setForm({ ...form, deadband: v })}
                    placeholder="0.5"
                  />
                </div>
                <div>
                  <Label>High-High</Label>
                  <Input
                    value={form.highHigh}
                    onChange={(v) => setForm({ ...form, highHigh: v })}
                    placeholder="e.g. 36.3"
                  />
                </div>
                <div>
                  <Label>High</Label>
                  <Input
                    value={form.high}
                    onChange={(v) => setForm({ ...form, high: v })}
                    placeholder="e.g. 34.65"
                  />
                </div>
                <div>
                  <Label>Low</Label>
                  <Input
                    value={form.low}
                    onChange={(v) => setForm({ ...form, low: v })}
                    placeholder="e.g. 29.7"
                  />
                </div>
                <div>
                  <Label>Low-Low</Label>
                  <Input
                    value={form.lowLow}
                    onChange={(v) => setForm({ ...form, lowLow: v })}
                    placeholder="e.g. 28.05"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <BtnPrimary onClick={handleSave}>
                  <Check className="h-4 w-4" />
                  Save Rule
                </BtnPrimary>
                <BtnSecondary onClick={() => setShowForm(false)}>Cancel</BtnSecondary>
              </div>
            </div>
          )}

          {alarmRules.length > 0 && (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-3 py-2">Tag</th>
                    <th className="px-3 py-2">Priority</th>
                    <th className="px-3 py-2">HH</th>
                    <th className="px-3 py-2">High</th>
                    <th className="px-3 py-2">Low</th>
                    <th className="px-3 py-2">LL</th>
                    <th className="px-3 py-2">Deadband</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alarmRules.map((rule, i) => (
                    <tr
                      key={rule.id}
                      className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {tagName(rule.tagId)}
                      </td>
                      <td className="px-3 py-2">
                        <PriorityBadge priority={rule.priority} />
                      </td>
                      <td className="px-3 py-2 text-gray-600">{rule.highHigh || '-'}</td>
                      <td className="px-3 py-2 text-gray-600">{rule.high || '-'}</td>
                      <td className="px-3 py-2 text-gray-600">{rule.low || '-'}</td>
                      <td className="px-3 py-2 text-gray-600">{rule.lowLow || '-'}</td>
                      <td className="px-3 py-2 text-gray-500">{rule.deadband}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() =>
                            dispatch({ type: 'DELETE_ALARM_RULE', payload: rule.id })
                          }
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {alarmRules.length === 0 && !showForm && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <AlertTriangle className="mb-2 h-10 w-10" />
              <p className="text-sm">
                No alarm rules configured. Add rules or apply a template.
              </p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: AlarmPriority }) {
  const colors: Record<AlarmPriority, string> = {
    Critical: 'bg-red-100 text-red-700',
    Major: 'bg-orange-100 text-orange-700',
    Minor: 'bg-yellow-100 text-yellow-700',
    Warning: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[priority]}`}>
      {priority}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 6: Review & Deploy                                            */
/* ------------------------------------------------------------------ */

function StepReview({
  state,
  dispatch,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      dispatch({ type: 'SET_DEPLOYED', payload: true });
      dispatch({ type: 'SET_SERVER_RUNNING', payload: true });
      setDeploying(false);
    }, 3000);
  };

  const handleToggleServer = () => {
    dispatch({ type: 'SET_SERVER_RUNNING', payload: !state.serverRunning });
  };

  const analogTagCount = state.tags.filter((t) => t.dataType === 'analog').length;
  const digitalTagCount = state.tags.filter((t) => t.dataType === 'digital').length;
  const counterTagCount = state.tags.filter((t) => t.dataType === 'counter').length;

  return (
    <div className="space-y-5">
      <Card title="Configuration Summary" icon={<Server className="h-5 w-5 text-blue-600" />}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* System Info */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-semibold text-gray-900">System Info</h4>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium text-gray-900">
                  {state.systemInfo.systemName || '-'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Organization</dt>
                <dd className="font-medium text-gray-900">
                  {state.systemInfo.organization || '-'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Admin</dt>
                <dd className="font-medium text-gray-900">
                  {state.systemInfo.adminEmail || '-'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Substations */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-semibold text-gray-900">Substations</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{state.substations.length}</p>
            <ul className="mt-2 space-y-0.5 text-xs text-gray-600">
              {state.substations.slice(0, 5).map((ss) => (
                <li key={ss.id} className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  {ss.name} ({ss.type})
                </li>
              ))}
              {state.substations.length > 5 && (
                <li className="text-gray-400">
                  +{state.substations.length - 5} more
                </li>
              )}
            </ul>
          </div>

          {/* Connections */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Cable className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-semibold text-gray-900">Connections</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{state.connections.length}</p>
            <ul className="mt-2 space-y-0.5 text-xs text-gray-600">
              {PROTOCOL_TYPES.map((pt) => {
                const count = state.connections.filter((c) => c.protocol === pt).length;
                if (count === 0) return null;
                return (
                  <li key={pt}>
                    {pt}: {count}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Tags */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-semibold text-gray-900">Tags</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{state.tags.length}</p>
            <div className="mt-2 flex gap-3 text-xs text-gray-600">
              <span>Analog: {analogTagCount}</span>
              <span>Digital: {digitalTagCount}</span>
              <span>Counter: {counterTagCount}</span>
            </div>
          </div>

          {/* Alarms */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-semibold text-gray-900">Alarm Rules</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{state.alarmRules.length}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {ALARM_PRIORITIES.map((p) => {
                const count = state.alarmRules.filter((r) => r.priority === p).length;
                if (count === 0) return null;
                return (
                  <span key={p}>
                    <PriorityBadge priority={p} /> {count}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Server Status */}
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Server className="h-4 w-4 text-gray-500" />
              <h4 className="text-sm font-semibold text-gray-900">Server Status</h4>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  state.serverRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  state.serverRunning ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {state.serverRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            {state.deployed && (
              <p className="mt-1 text-xs text-gray-500">
                Configuration deployed successfully
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Deploy & Server Controls */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <BtnPrimary onClick={handleDeploy} disabled={deploying || state.deployed}>
            {deploying ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : state.deployed ? (
              <Check className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {deploying
              ? 'Deploying Configuration...'
              : state.deployed
                ? 'Configuration Deployed'
                : 'Deploy Configuration'}
          </BtnPrimary>

          {state.deployed && (
            <>
              {state.serverRunning ? (
                <BtnDanger onClick={handleToggleServer}>
                  <Square className="h-4 w-4" />
                  Stop Server
                </BtnDanger>
              ) : (
                <BtnPrimary onClick={handleToggleServer} className="bg-green-600 hover:bg-green-700 focus:ring-green-500">
                  <Play className="h-4 w-4" />
                  Start Server
                </BtnPrimary>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Wizard Component                                              */
/* ------------------------------------------------------------------ */

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!(
          state.systemInfo.systemName.trim() &&
          state.systemInfo.adminEmail.trim() &&
          state.systemInfo.adminPassword.trim() &&
          state.systemInfo.adminPassword === state.systemInfo.adminPasswordConfirm
        );
      case 1:
        return state.substations.length > 0;
      case 2:
        return state.connections.length > 0;
      case 3:
        return state.tags.length > 0;
      case 4:
        return true; // alarms are optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1 && canGoNext()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepSystemInfo systemInfo={state.systemInfo} dispatch={dispatch} />;
      case 1:
        return <StepSubstations substations={state.substations} dispatch={dispatch} />;
      case 2:
        return (
          <StepProtocols
            substations={state.substations}
            connections={state.connections}
            dispatch={dispatch}
          />
        );
      case 3:
        return (
          <StepTagMapping
            connections={state.connections}
            substations={state.substations}
            tags={state.tags}
            dispatch={dispatch}
          />
        );
      case 4:
        return (
          <StepAlarms tags={state.tags} alarmRules={state.alarmRules} dispatch={dispatch} />
        );
      case 5:
        return <StepReview state={state} dispatch={dispatch} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">GridVision SCADA Setup Wizard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your SCADA system step by step
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-5">
          <BtnSecondary onClick={goPrev} disabled={currentStep === 0}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </BtnSecondary>

          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {STEPS.length}
          </span>

          {currentStep < STEPS.length - 1 ? (
            <BtnPrimary onClick={goNext} disabled={!canGoNext()}>
              Next
              <ChevronRight className="h-4 w-4" />
            </BtnPrimary>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
