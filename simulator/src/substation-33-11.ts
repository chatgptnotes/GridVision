/**
 * 33/11 kV Substation Simulator
 * Generates realistic power system data for a typical 33/11 kV substation
 */

export interface SimulatedPoint {
  tag: string;
  value: number;
  type: 'analog' | 'digital';
}

export class Substation33_11Simulator {
  private code: string;
  private baseLoad: number; // MW
  private time: number = 0;

  constructor(code: string, baseLoadMW: number = 5) {
    this.code = code;
    this.baseLoad = baseLoadMW;
  }

  generate(): SimulatedPoint[] {
    this.time++;
    const points: SimulatedPoint[] = [];
    const hour = new Date().getHours();

    // Load profile follows typical daily pattern
    const loadFactor = this.getDailyLoadFactor(hour);
    const totalLoad = this.baseLoad * loadFactor;

    // Transformer parameters
    const hvVoltage = 33 + (Math.random() - 0.5) * 1.5; // 32.25 - 33.75 kV
    const lvVoltage = 11 + (Math.random() - 0.5) * 0.4; // 10.8 - 11.2 kV
    const trCurrent = (totalLoad * 1000) / (1.732 * hvVoltage); // I = P / (√3 * V)
    const tapPosition = Math.round(5 + (33 - hvVoltage) * 0.5); // Auto tap
    const oilTemp = 35 + totalLoad * 3 + Math.random() * 2; // Base + load-dependent

    points.push(
      { tag: `${this.code}_TR1_V_HV`, value: hvVoltage, type: 'analog' },
      { tag: `${this.code}_TR1_V_LV`, value: lvVoltage, type: 'analog' },
      { tag: `${this.code}_TR1_I_HV`, value: trCurrent, type: 'analog' },
      { tag: `${this.code}_TR1_P_3PH`, value: totalLoad, type: 'analog' },
      { tag: `${this.code}_TR1_TAP_POS`, value: tapPosition, type: 'analog' },
      { tag: `${this.code}_TR1_OIL_TEMP`, value: oilTemp, type: 'analog' },
    );

    // CB status (all closed normally)
    points.push(
      { tag: `${this.code}_33KV_INC1_CB_STATUS`, value: 1, type: 'digital' },
      { tag: `${this.code}_33KV_BSC_CB_STATUS`, value: 1, type: 'digital' },
      { tag: `${this.code}_33KV_TR1_CB_STATUS`, value: 1, type: 'digital' },
    );

    // Distribute load across 6 feeders with varying proportions
    const feederShares = [0.22, 0.18, 0.15, 0.20, 0.12, 0.13];

    for (let i = 0; i < 6; i++) {
      const fdrNum = String(i + 1).padStart(2, '0');
      const feederLoad = totalLoad * feederShares[i] * (0.9 + Math.random() * 0.2);
      const feederPF = 0.85 + Math.random() * 0.12;
      const feederReactive = feederLoad * Math.tan(Math.acos(feederPF));
      const feederCurrent = (feederLoad * 1000) / (1.732 * lvVoltage * feederPF);

      // Small per-phase imbalance
      const imbalance = () => 1 + (Math.random() - 0.5) * 0.06;

      points.push(
        { tag: `${this.code}_11KV_FDR${fdrNum}_V_RY`, value: lvVoltage * (1 + (Math.random() - 0.5) * 0.02), type: 'analog' },
        { tag: `${this.code}_11KV_FDR${fdrNum}_I_R`, value: feederCurrent * imbalance(), type: 'analog' },
        { tag: `${this.code}_11KV_FDR${fdrNum}_I_Y`, value: feederCurrent * imbalance(), type: 'analog' },
        { tag: `${this.code}_11KV_FDR${fdrNum}_I_B`, value: feederCurrent * imbalance(), type: 'analog' },
        { tag: `${this.code}_11KV_FDR${fdrNum}_P_3PH`, value: feederLoad, type: 'analog' },
        { tag: `${this.code}_11KV_FDR${fdrNum}_Q_3PH`, value: feederReactive, type: 'analog' },
        { tag: `${this.code}_11KV_FDR${fdrNum}_PF`, value: feederPF, type: 'analog' },
        { tag: `${this.code}_11KV_FDR${fdrNum}_CB_STATUS`, value: 1, type: 'digital' },
      );
    }

    return points;
  }

  private getDailyLoadFactor(hour: number): number {
    // Typical Indian load curve
    const curve: Record<number, number> = {
      0: 0.45, 1: 0.40, 2: 0.38, 3: 0.35, 4: 0.37, 5: 0.42,
      6: 0.55, 7: 0.70, 8: 0.82, 9: 0.90, 10: 0.95, 11: 0.98,
      12: 0.92, 13: 0.88, 14: 0.90, 15: 0.93, 16: 0.95, 17: 0.97,
      18: 1.00, 19: 0.98, 20: 0.95, 21: 0.85, 22: 0.70, 23: 0.55,
    };
    return curve[hour] || 0.7;
  }
}
