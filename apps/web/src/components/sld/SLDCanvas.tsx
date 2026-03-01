import { useRef, useCallback, MouseEvent, WheelEvent } from 'react';
import { useSLDStore } from '@/stores/sldStore';
import SLDViewport from './SLDViewport';
import Layout33_11kV from './layouts/Layout33_11kV';
import Layout132_33kV from './layouts/Layout132_33kV';
import type { Substation } from '@gridvision/shared';

interface Props {
  substation: Substation;
  onEquipmentDoubleClick: () => void;
}

export default function SLDCanvas({ substation, onEquipmentDoubleClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoom = useSLDStore((s) => s.zoom);
  const panX = useSLDStore((s) => s.panX);
  const panY = useSLDStore((s) => s.panY);
  const setZoom = useSLDStore((s) => s.setZoom);
  const setPan = useSLDStore((s) => s.setPan);
  const setSelectedEquipment = useSLDStore((s) => s.setSelectedEquipment);
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(zoom + delta);
  }, [zoom, setZoom]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      isPanning.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning.current) {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      setPan(panX + dx, panY + dy);
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  }, [panX, panY, setPan]);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const handleEquipmentClick = useCallback((equipmentId: string) => {
    setSelectedEquipment(equipmentId);
  }, [setSelectedEquipment]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <SLDViewport zoom={zoom} panX={panX} panY={panY}>
        {substation.type === '33/11kV' ? (
          <Layout33_11kV
            substationCode={substation.code}
            onEquipmentClick={handleEquipmentClick}
            onEquipmentDoubleClick={onEquipmentDoubleClick}
          />
        ) : (
          <Layout132_33kV
            substationCode={substation.code}
            onEquipmentClick={handleEquipmentClick}
            onEquipmentDoubleClick={onEquipmentDoubleClick}
          />
        )}
      </SLDViewport>
    </div>
  );
}
