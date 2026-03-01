import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { Substation } from '@gridvision/shared';

interface Props {
  substationId: string;
}

export default function SubstationOverview({ substationId }: Props) {
  const [substation, setSubstation] = useState<Substation | null>(null);

  useEffect(() => {
    api.get(`/substations/${substationId}`).then(({ data }) => setSubstation(data));
  }, [substationId]);

  if (!substation) return null;

  return (
    <div className="bg-scada-panel border border-scada-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{substation.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
            <span className="px-2 py-0.5 rounded bg-scada-accent/20 text-scada-accent text-xs">{substation.type}</span>
            <span>{substation.location}</span>
            <span>Code: {substation.code}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${substation.status === 'ACTIVE' ? 'bg-scada-success' : 'bg-gray-500'}`} />
          <span className="text-sm">{substation.status}</span>
        </div>
      </div>
    </div>
  );
}
