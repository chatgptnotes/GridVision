import { create } from 'zustand';
import type { Substation } from '@gridvision/shared';

interface SLDState {
  selectedSubstation: Substation | null;
  zoom: number;
  panX: number;
  panY: number;
  selectedEquipmentId: string | null;

  setSelectedSubstation: (substation: Substation | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setSelectedEquipment: (id: string | null) => void;
  resetView: () => void;
}

export const useSLDStore = create<SLDState>()((set) => ({
  selectedSubstation: null,
  zoom: 1,
  panX: 0,
  panY: 0,
  selectedEquipmentId: null,

  setSelectedSubstation: (substation) => set({ selectedSubstation: substation }),
  setZoom: (zoom) => set({ zoom: Math.max(0.2, Math.min(3, zoom)) }),
  setPan: (panX, panY) => set({ panX, panY }),
  setSelectedEquipment: (selectedEquipmentId) => set({ selectedEquipmentId }),
  resetView: () => set({ zoom: 1, panX: 0, panY: 0, selectedEquipmentId: null }),
}));
