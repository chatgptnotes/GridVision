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

export default function Layout33_11kV({ substationCode, onEquipmentClick, onEquipmentDoubleClick }: Props) {
  const sc = substationCode;
  const bus33Y = 150;
  const bus11Y = 450;
  const feederCount = 6;

  return (
    <g>
      {/* Title */}
      <text x={600} y={30} textAnchor="middle" className="text-sm fill-gray-300 font-semibold">
        {sc} - 33/11 kV Substation Single Line Diagram
      </text>

      {/* 33kV Incoming Line */}
      <line x1={300} y1={50} x2={300} y2={bus33Y - 40} stroke="#DC2626" strokeWidth={2} />
      <text x={300} y={45} textAnchor="middle" className="text-[9px] fill-gray-400">33kV Incoming</text>

      {/* 33kV Incomer CB */}
      <CircuitBreaker
        x={300} y={bus33Y - 30}
        tag={`${sc}_33KV_INC1_CB`}
        label="INC1"
        onClick={() => onEquipmentClick('inc1-cb')}
        onDoubleClick={onEquipmentDoubleClick}
      />

      {/* 33kV Bus Section 1 */}
      <BusBar x={100} y={bus33Y} width={350} voltageKv={33} label="33kV Bus Section 1" />

      {/* 33kV Bus Section CB */}
      <CircuitBreaker
        x={500} y={bus33Y}
        tag={`${sc}_33KV_BSC_CB`}
        label="BSC"
        onClick={() => onEquipmentClick('bsc-cb')}
        onDoubleClick={onEquipmentDoubleClick}
      />

      {/* 33kV Bus Section 2 */}
      <BusBar x={550} y={bus33Y} width={350} voltageKv={33} label="33kV Bus Section 2" />

      {/* Transformer 1 */}
      <line x1={300} y1={bus33Y} x2={300} y2={bus33Y + 20} stroke="#94A3B8" strokeWidth={2} />
      <CircuitBreaker
        x={300} y={bus33Y + 30}
        tag={`${sc}_33KV_TR1_CB`}
        label="TR1 HV"
        onClick={() => onEquipmentClick('tr1-hv-cb')}
        onDoubleClick={onEquipmentDoubleClick}
      />
      <PowerTransformer x={300} y={bus33Y + 90} hvVoltage={33} lvVoltage={11} label="TR-1" mva={8} />

      {/* TR1 Measurements */}
      <MeasurementLabel x={340} y={bus33Y + 60} tag={`${sc}_TR1_V_HV`} label="V" unit="kV" />
      <MeasurementLabel x={340} y={bus33Y + 78} tag={`${sc}_TR1_I_HV`} label="I" unit="A" />
      <MeasurementLabel x={340} y={bus33Y + 96} tag={`${sc}_TR1_P_3PH`} label="P" unit="MW" />
      <MeasurementLabel x={340} y={bus33Y + 114} tag={`${sc}_TR1_OIL_TEMP`} label="T" unit="°C" />

      {/* TR1 LV CB */}
      <CircuitBreaker
        x={300} y={bus33Y + 150}
        tag={`${sc}_11KV_TR1_CB`}
        label="TR1 LV"
        onClick={() => onEquipmentClick('tr1-lv-cb')}
        onDoubleClick={onEquipmentDoubleClick}
      />
      <line x1={300} y1={bus33Y + 170} x2={300} y2={bus11Y} stroke="#94A3B8" strokeWidth={2} />

      {/* Transformer 2 */}
      <line x1={700} y1={bus33Y} x2={700} y2={bus33Y + 20} stroke="#94A3B8" strokeWidth={2} />
      <CircuitBreaker
        x={700} y={bus33Y + 30}
        tag={`${sc}_33KV_TR2_CB`}
        label="TR2 HV"
        onClick={() => onEquipmentClick('tr2-hv-cb')}
        onDoubleClick={onEquipmentDoubleClick}
      />
      <PowerTransformer x={700} y={bus33Y + 90} hvVoltage={33} lvVoltage={11} label="TR-2" mva={8} />
      <CircuitBreaker
        x={700} y={bus33Y + 150}
        tag={`${sc}_11KV_TR2_CB`}
        label="TR2 LV"
        onClick={() => onEquipmentClick('tr2-lv-cb')}
        onDoubleClick={onEquipmentDoubleClick}
      />
      <line x1={700} y1={bus33Y + 170} x2={700} y2={bus11Y} stroke="#94A3B8" strokeWidth={2} />

      {/* 11kV Bus Section 1 */}
      <BusBar x={80} y={bus11Y} width={370} voltageKv={11} label="11kV Bus Section 1" />

      {/* 11kV Bus Coupler CB */}
      <CircuitBreaker
        x={500} y={bus11Y}
        tag={`${sc}_11KV_BC_CB`}
        label="BC"
        onClick={() => onEquipmentClick('bc-cb')}
        onDoubleClick={onEquipmentDoubleClick}
      />

      {/* 11kV Bus Section 2 */}
      <BusBar x={550} y={bus11Y} width={370} voltageKv={11} label="11kV Bus Section 2" />

      {/* 11kV Feeders */}
      {Array.from({ length: feederCount }, (_, i) => {
        const fdrNum = String(i + 1).padStart(2, '0');
        const fdrX = i < 3
          ? 130 + i * 120 // Bus section 1
          : 580 + (i - 3) * 120; // Bus section 2

        return (
          <g key={`fdr${i + 1}`}>
            <line x1={fdrX} y1={bus11Y} x2={fdrX} y2={bus11Y + 15} stroke="#94A3B8" strokeWidth={2} />
            <CircuitBreaker
              x={fdrX} y={bus11Y + 25}
              tag={`${sc}_11KV_FDR${fdrNum}_CB`}
              label={`F${i + 1}`}
              onClick={() => onEquipmentClick(`fdr${fdrNum}-cb`)}
              onDoubleClick={onEquipmentDoubleClick}
            />
            <FeederLine x={fdrX} y={bus11Y + 50} voltageKv={11} label={`FDR ${i + 1}`} />

            {/* Feeder measurements */}
            <MeasurementLabel x={fdrX + 15} y={bus11Y + 55} tag={`${sc}_11KV_FDR${fdrNum}_I_R`} label="I" unit="A" />
            <MeasurementLabel x={fdrX + 15} y={bus11Y + 73} tag={`${sc}_11KV_FDR${fdrNum}_P_3PH`} label="P" unit="MW" />
          </g>
        );
      })}
    </g>
  );
}
