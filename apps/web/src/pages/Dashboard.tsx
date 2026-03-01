import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useAlarmStore } from '@/stores/alarmStore';
import { useRealtimeStore } from '@/stores/realtimeStore';
import ParameterCard from '@/components/dashboard/ParameterCard';
import LoadDistribution from '@/components/dashboard/LoadDistribution';
import PowerFactorGauge from '@/components/dashboard/PowerFactorGauge';
import SubstationOverview from '@/components/dashboard/SubstationOverview';
import type { Substation } from '@gridvision/shared';

export default function Dashboard() {
  const [substations, setSubstations] = useState<Substation[]>([]);
  const [selectedSS, setSelectedSS] = useState<string | null>(null);
  const summary = useAlarmStore((s) => s.summary);
  const connectionStatus = useRealtimeStore((s) => s.connectionStatus);

  useEffect(() => {
    api.get('/substations').then(({ data }) => {
      setSubstations(data);
      if (data.length > 0 && !selectedSS) {
        setSelectedSS(data[0].id);
      }
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">System Dashboard</h2>
        <select
          value={selectedSS || ''}
          onChange={(e) => setSelectedSS(e.target.value)}
          className="bg-scada-panel border border-scada-border rounded px-3 py-1.5 text-sm"
        >
          {substations.map((ss) => (
            <option key={ss.id} value={ss.id}>
              {ss.name}
            </option>
          ))}
        </select>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Substations" value={substations.length} icon="building" />
        <StatCard
          label="Active Alarms"
          value={summary.total}
          icon="bell"
          variant={summary.emergency > 0 ? 'danger' : summary.total > 0 ? 'warning' : 'normal'}
        />
        <StatCard
          label="Unacknowledged"
          value={summary.unacknowledged}
          icon="alert"
          variant={summary.unacknowledged > 0 ? 'warning' : 'normal'}
        />
        <StatCard
          label="Data Link"
          value={connectionStatus === 'connected' ? 'ONLINE' : 'OFFLINE'}
          icon="link"
          variant={connectionStatus === 'connected' ? 'success' : 'danger'}
        />
      </div>

      {/* Alarm Summary Bar */}
      <div className="bg-scada-panel border border-scada-border rounded-lg p-3">
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-400 font-medium">Alarm Summary:</span>
          <AlarmCount label="Emergency" count={summary.emergency} color="bg-red-600" />
          <AlarmCount label="Urgent" count={summary.urgent} color="bg-orange-500" />
          <AlarmCount label="Normal" count={summary.normal} color="bg-yellow-500" />
          <AlarmCount label="Info" count={summary.info} color="bg-blue-500" />
        </div>
      </div>

      {selectedSS && (
        <>
          {/* Substation Overview */}
          <SubstationOverview substationId={selectedSS} />

          {/* Main Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Parameter Cards */}
            <div className="col-span-2 grid grid-cols-3 gap-3">
              <ParameterCard tag={`WALUJ_TR1_V_HV`} label="TR1 HV Voltage" unit="kV" />
              <ParameterCard tag={`WALUJ_TR1_V_LV`} label="TR1 LV Voltage" unit="kV" />
              <ParameterCard tag={`WALUJ_TR1_I_HV`} label="TR1 HV Current" unit="A" />
              <ParameterCard tag={`WALUJ_TR1_P_3PH`} label="TR1 Active Power" unit="MW" />
              <ParameterCard tag={`WALUJ_TR1_OIL_TEMP`} label="TR1 Oil Temp" unit="°C" />
              <ParameterCard tag={`WALUJ_TR1_TAP_POS`} label="TR1 Tap Position" unit="" />
            </div>

            {/* Power Factor Gauge */}
            <div className="space-y-3">
              <PowerFactorGauge tag="WALUJ_11KV_FDR01_PF" label="Feeder 1 PF" />
              <PowerFactorGauge tag="WALUJ_11KV_FDR02_PF" label="Feeder 2 PF" />
            </div>
          </div>

          {/* Load Distribution */}
          <LoadDistribution substationCode="WALUJ" feederCount={6} />
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, variant = 'normal' }: {
  label: string;
  value: number | string;
  icon: string;
  variant?: 'normal' | 'success' | 'warning' | 'danger';
}) {
  const colors = {
    normal: 'text-scada-text',
    success: 'text-scada-success',
    warning: 'text-scada-warning',
    danger: 'text-scada-danger',
  };

  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold font-mono ${colors[variant]}`}>{value}</div>
    </div>
  );
}

function AlarmCount({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded ${color} ${count > 0 ? 'animate-pulse' : 'opacity-30'}`} />
      <span className="text-sm">
        {label}: <span className="font-bold text-white">{count}</span>
      </span>
    </div>
  );
}
