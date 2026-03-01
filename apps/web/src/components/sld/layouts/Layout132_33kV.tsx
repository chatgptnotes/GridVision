import BusBar from '../equipment/BusBar';
import CircuitBreaker from '../equipment/CircuitBreaker';
import PowerTransformer from '../equipment/PowerTransformer';
import FeederLine from '../equipment/FeederLine';
import MeasurementLabel from '../overlays/MeasurementLabel';

interface Props {
  substationCode: string;
  onEquipmentClick: (id: string) => void;
  onEquipmentDoubleClick: () => void;
}

export default function Layout132_33kV({ substationCode, onEquipmentClick, onEquipmentDoubleClick }: Props) {
  const sc = substationCode;
  const bus132Y = 120;
  const bus33Y = 450;

  return (
    <g>
      {/* Title */}
      <text x={600} y={30} textAnchor="middle" className="text-sm fill-gray-300 font-semibold">
        {sc} - 132/33 kV Substation Single Line Diagram
      </text>

      {/* 132kV Incoming Lines */}
      <line x1={300} y1={50} x2={300} y2={bus132Y - 30} stroke="#1E40AF" strokeWidth={2} />
      <text x={300} y={45} textAnchor="middle" className="text-[9px] fill-gray-400">132kV Line 1</text>
      <CircuitBreaker x={300} y={bus132Y - 25} tag={`${sc}_132KV_L1_CB`} label="L1"
        onClick={() => onEquipmentClick('l1-cb')} onDoubleClick={onEquipmentDoubleClick} />

      <line x1={700} y1={50} x2={700} y2={bus132Y - 30} stroke="#1E40AF" strokeWidth={2} />
      <text x={700} y={45} textAnchor="middle" className="text-[9px] fill-gray-400">132kV Line 2</text>
      <CircuitBreaker x={700} y={bus132Y - 25} tag={`${sc}_132KV_L2_CB`} label="L2"
        onClick={() => onEquipmentClick('l2-cb')} onDoubleClick={onEquipmentDoubleClick} />

      {/* 132kV Bus */}
      <BusBar x={150} y={bus132Y} width={700} voltageKv={132} label="132kV Bus" />

      {/* Transformer 1 */}
      <line x1={400} y1={bus132Y} x2={400} y2={bus132Y + 20} stroke="#94A3B8" strokeWidth={2} />
      <CircuitBreaker x={400} y={bus132Y + 30} tag={`${sc}_132KV_TR1_CB`} label="TR1 HV"
        onClick={() => onEquipmentClick('tr1-hv-cb')} onDoubleClick={onEquipmentDoubleClick} />
      <PowerTransformer x={400} y={bus132Y + 100} hvVoltage={132} lvVoltage={33} label="TR-1" mva={40} />

      <MeasurementLabel x={445} y={bus132Y + 70} tag={`${sc}_TR1_V_HV`} label="V HV" unit="kV" />
      <MeasurementLabel x={445} y={bus132Y + 88} tag={`${sc}_TR1_P_3PH`} label="P" unit="MW" />

      <CircuitBreaker x={400} y={bus132Y + 175} tag={`${sc}_33KV_TR1_CB`} label="TR1 LV"
        onClick={() => onEquipmentClick('tr1-lv-cb')} onDoubleClick={onEquipmentDoubleClick} />
      <line x1={400} y1={bus132Y + 195} x2={400} y2={bus33Y} stroke="#94A3B8" strokeWidth={2} />

      {/* Transformer 2 */}
      <line x1={600} y1={bus132Y} x2={600} y2={bus132Y + 20} stroke="#94A3B8" strokeWidth={2} />
      <CircuitBreaker x={600} y={bus132Y + 30} tag={`${sc}_132KV_TR2_CB`} label="TR2 HV"
        onClick={() => onEquipmentClick('tr2-hv-cb')} onDoubleClick={onEquipmentDoubleClick} />
      <PowerTransformer x={600} y={bus132Y + 100} hvVoltage={132} lvVoltage={33} label="TR-2" mva={40} />
      <CircuitBreaker x={600} y={bus132Y + 175} tag={`${sc}_33KV_TR2_CB`} label="TR2 LV"
        onClick={() => onEquipmentClick('tr2-lv-cb')} onDoubleClick={onEquipmentDoubleClick} />
      <line x1={600} y1={bus132Y + 195} x2={600} y2={bus33Y} stroke="#94A3B8" strokeWidth={2} />

      {/* 33kV Bus Section 1 */}
      <BusBar x={100} y={bus33Y} width={350} voltageKv={33} label="33kV Bus Section 1" />

      {/* 33kV BSC CB */}
      <CircuitBreaker x={500} y={bus33Y} tag={`${sc}_33KV_BSC_CB`} label="BSC"
        onClick={() => onEquipmentClick('bsc-cb')} onDoubleClick={onEquipmentDoubleClick} />

      {/* 33kV Bus Section 2 */}
      <BusBar x={550} y={bus33Y} width={350} voltageKv={33} label="33kV Bus Section 2" />

      {/* 33kV Feeders */}
      {Array.from({ length: 8 }, (_, i) => {
        const fdrNum = String(i + 1).padStart(2, '0');
        const fdrX = i < 4
          ? 150 + i * 100
          : 600 + (i - 4) * 100;

        return (
          <g key={`fdr${i + 1}`}>
            <line x1={fdrX} y1={bus33Y} x2={fdrX} y2={bus33Y + 15} stroke="#94A3B8" strokeWidth={2} />
            <CircuitBreaker x={fdrX} y={bus33Y + 25} tag={`${sc}_33KV_FDR${fdrNum}_CB`} label={`F${i + 1}`}
              onClick={() => onEquipmentClick(`fdr${fdrNum}-cb`)} onDoubleClick={onEquipmentDoubleClick} />
            <FeederLine x={fdrX} y={bus33Y + 50} voltageKv={33} label={`FDR ${i + 1}`} />
            <MeasurementLabel x={fdrX + 15} y={bus33Y + 55} tag={`${sc}_33KV_FDR${fdrNum}_I_R`} label="I" unit="A" />
          </g>
        );
      })}
    </g>
  );
}
