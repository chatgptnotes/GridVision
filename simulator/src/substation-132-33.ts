/**
 * 132/33 kV Substation Simulator
 * Generates realistic power system data for a 132/33 kV MSEDCL substation
 */

import type { SimulatedPoint } from './substation-33-11';

export class Substation132_33Simulator {
  private code: string;
  private baseLoad: number;
  private time: number = 0;

  constructor(code: string, baseLoadMW: number = 25) {
    this.code = code;
    this.baseLoad = baseLoadMW;
  }

  generate(): SimulatedPoint[] {
    this.time++;
    const points: SimulatedPoint[] = [];
    const hour = new Date().getHours();
    const loadFactor = this.getDailyLoadFactor(hour);
    const totalLoad = this.baseLoad * loadFactor;

    // 132kV bus voltage
    const hv132 = 132 + (Math.random() - 0.5) * 5;

    // Transformer parameters (2 transformers, load shared)
    for (let tr = 1; tr <= 2; tr++) {
      const trLoad = totalLoad / 2 * (0.9 + Math.random() * 0.2);
      const trCurrent = (trLoad * 1000) / (1.732 * hv132);
      const lv33 = 33 + (Math.random() - 0.5) * 1.5;
      const tapPos = Math.round(8 + (132 - hv132) * 0.1);
      const oilTemp = 40 + trLoad * 0.8 + Math.random() * 3;

      points.push(
        { tag: `${this.code}_TR${tr}_V_HV`, value: hv132, type: 'analog' },
        { tag: `${this.code}_TR${tr}_V_LV`, value: lv33, type: 'analog' },
        { tag: `${this.code}_TR${tr}_I_HV`, value: trCurrent, type: 'analog' },
        { tag: `${this.code}_TR${tr}_P_3PH`, value: trLoad, type: 'analog' },
        { tag: `${this.code}_TR${tr}_TAP_POS`, value: tapPos, type: 'analog' },
        { tag: `${this.code}_TR${tr}_OIL_TEMP`, value: oilTemp, type: 'analog' },
      );

      // CB status
      points.push(
        { tag: `${this.code}_132KV_TR${tr}_CB_STATUS`, value: 1, type: 'digital' },
        { tag: `${this.code}_33KV_TR${tr}_CB_STATUS`, value: 1, type: 'digital' },
      );
    }

    // 132kV line CBs
    points.push(
      { tag: `${this.code}_132KV_L1_CB_STATUS`, value: 1, type: 'digital' },
      { tag: `${this.code}_132KV_L2_CB_STATUS`, value: 1, type: 'digital' },
      { tag: `${this.code}_33KV_BSC_CB_STATUS`, value: 1, type: 'digital' },
    );

    // 8 feeders at 33kV
    const feederShares = [0.15, 0.13, 0.12, 0.14, 0.11, 0.10, 0.13, 0.12];

    for (let i = 0; i < 8; i++) {
      const fdrNum = String(i + 1).padStart(2, '0');
      const feederLoad = totalLoad * feederShares[i] * (0.9 + Math.random() * 0.2);
      const feederPF = 0.87 + Math.random() * 0.10;
      const fdrVoltage = 33 + (Math.random() - 0.5) * 1;
      const feederCurrent = (feederLoad * 1000) / (1.732 * fdrVoltage * feederPF);
      const feederReactive = feederLoad * Math.tan(Math.acos(feederPF));
      const imbalance = () => 1 + (Math.random() - 0.5) * 0.04;

      points.push(
        { tag: `${this.code}_33KV_FDR${fdrNum}_V_RY`, value: fdrVoltage, type: 'analog' },
        { tag: `${this.code}_33KV_FDR${fdrNum}_I_R`, value: feederCurrent * imbalance(), type: 'analog' },
        { tag: `${this.code}_33KV_FDR${fdrNum}_I_Y`, value: feederCurrent * imbalance(), type: 'analog' },
        { tag: `${this.code}_33KV_FDR${fdrNum}_I_B`, value: feederCurrent * imbalance(), type: 'analog' },
        { tag: `${this.code}_33KV_FDR${fdrNum}_P_3PH`, value: feederLoad, type: 'analog' },
        { tag: `${this.code}_33KV_FDR${fdrNum}_Q_3PH`, value: feederReactive, type: 'analog' },
        { tag: `${this.code}_33KV_FDR${fdrNum}_PF`, value: feederPF, type: 'analog' },
        { tag: `${this.code}_33KV_FDR${fdrNum}_CB_STATUS`, value: 1, type: 'digital' },
      );
    }

    return points;
  }

  private getDailyLoadFactor(hour: number): number {
    const curve: Record<number, number> = {
      0: 0.50, 1: 0.45, 2: 0.42, 3: 0.40, 4: 0.42, 5: 0.48,
      6: 0.60, 7: 0.72, 8: 0.85, 9: 0.92, 10: 0.96, 11: 1.00,
      12: 0.95, 13: 0.90, 14: 0.92, 15: 0.95, 16: 0.97, 17: 0.98,
      18: 1.00, 19: 0.97, 20: 0.92, 21: 0.82, 22: 0.68, 23: 0.58,
    };
    return curve[hour] || 0.7;
  }
}
