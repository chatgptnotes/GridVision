import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { useSLDStore } from '@/stores/sldStore';
import SLDCanvas from '@/components/sld/SLDCanvas';
import ControlDialog from '@/components/controls/ControlDialog';
import type { Substation } from '@gridvision/shared';

export default function SLDView() {
  const { substationId } = useParams();
  const [substations, setSubstations] = useState<Substation[]>([]);
  const [showControl, setShowControl] = useState(false);
  const selectedSubstation = useSLDStore((s) => s.selectedSubstation);
  const setSelectedSubstation = useSLDStore((s) => s.setSelectedSubstation);
  const selectedEquipmentId = useSLDStore((s) => s.selectedEquipmentId);
  const zoom = useSLDStore((s) => s.zoom);
  const setZoom = useSLDStore((s) => s.setZoom);
  const resetView = useSLDStore((s) => s.resetView);

  useEffect(() => {
    api.get('/substations').then(({ data }) => {
      setSubstations(data);
      if (substationId) {
        const ss = data.find((s: Substation) => s.id === substationId);
        if (ss) setSelectedSubstation(ss);
      } else if (data.length > 0 && !selectedSubstation) {
        setSelectedSubstation(data[0]);
      }
    });
  }, [substationId]);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-scada-panel border border-scada-border rounded-lg px-4 py-2">
        <div className="flex items-center gap-3">
          <select
            value={selectedSubstation?.id || ''}
            onChange={(e) => {
              const ss = substations.find((s) => s.id === e.target.value);
              if (ss) setSelectedSubstation(ss);
            }}
            className="bg-scada-bg border border-scada-border rounded px-3 py-1 text-sm"
          >
            {substations.map((ss) => (
              <option key={ss.id} value={ss.id}>{ss.name}</option>
            ))}
          </select>

          {selectedSubstation && (
            <span className="text-xs px-2 py-0.5 rounded bg-scada-accent/20 text-scada-accent">
              {selectedSubstation.type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Zoom: {Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(zoom + 0.1)} className="px-2 py-1 bg-scada-bg border border-scada-border rounded text-sm hover:bg-scada-border/50">+</button>
          <button onClick={() => setZoom(zoom - 0.1)} className="px-2 py-1 bg-scada-bg border border-scada-border rounded text-sm hover:bg-scada-border/50">-</button>
          <button onClick={resetView} className="px-2 py-1 bg-scada-bg border border-scada-border rounded text-sm hover:bg-scada-border/50">Reset</button>
        </div>
      </div>

      {/* SLD Canvas */}
      <div className="flex-1 bg-scada-panel border border-scada-border rounded-lg overflow-hidden">
        {selectedSubstation ? (
          <SLDCanvas
            substation={selectedSubstation}
            onEquipmentDoubleClick={() => setShowControl(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a substation to view its Single Line Diagram
          </div>
        )}
      </div>

      {/* Control Dialog */}
      {showControl && selectedEquipmentId && (
        <ControlDialog
          equipmentId={selectedEquipmentId}
          onClose={() => setShowControl(false)}
        />
      )}
    </div>
  );
}
