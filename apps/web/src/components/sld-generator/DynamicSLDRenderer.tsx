import type { SLDLayout, SLDElement, SLDConnection } from '@gridvision/shared';
import { VOLTAGE_COLORS } from '@gridvision/shared';

interface Props {
  layout: SLDLayout;
}

function getVoltageColor(voltageLevel: number): string {
  return VOLTAGE_COLORS[voltageLevel] || VOLTAGE_COLORS[0] || '#94A3B8';
}

function renderCircuitBreaker(el: SLDElement) {
  const { x, y, label } = el;
  const size = 20;
  const color = '#16A34A';
  return (
    <g key={el.id}>
      <rect
        x={x - size / 2} y={y - size / 2}
        width={size} height={size}
        fill={color} stroke={color} strokeWidth={2} rx={2}
      />
      <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} stroke="white" strokeWidth={2} />
      <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} stroke="white" strokeWidth={2} />
      {label && (
        <text x={x + size / 2 + 5} y={y + 4} className="text-[8px] fill-gray-400">{label}</text>
      )}
    </g>
  );
}

function renderIsolator(el: SLDElement) {
  const { x, y, label } = el;
  const color = '#16A34A';
  return (
    <g key={el.id}>
      <line x1={x} y1={y - 15} x2={x} y2={y - 5} stroke="#94A3B8" strokeWidth={2} />
      <line x1={x} y1={y + 15} x2={x} y2={y + 5} stroke="#94A3B8" strokeWidth={2} />
      <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke={color} strokeWidth={2} />
      <circle cx={x} cy={y - 5} r={3} fill={color} />
      <circle cx={x} cy={y + 5} r={3} fill={color} />
      {label && (
        <text x={x + 10} y={y + 3} className="text-[7px] fill-gray-500">{label}</text>
      )}
    </g>
  );
}

function renderEarthSwitch(el: SLDElement) {
  const { x, y } = el;
  const color = '#16A34A';
  return (
    <g key={el.id}>
      <line x1={x} y1={y - 8} x2={x} y2={y} stroke={color} strokeWidth={1.5} />
      <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={color} strokeWidth={1.5} />
      <line x1={x - 4} y1={y + 3} x2={x + 4} y2={y + 3} stroke={color} strokeWidth={1.5} />
      <line x1={x - 2} y1={y + 6} x2={x + 2} y2={y + 6} stroke={color} strokeWidth={1.5} />
    </g>
  );
}

function renderPowerTransformer(el: SLDElement) {
  const { x, y, label, metadata } = el;
  const hvVoltage = (metadata?.hvVoltage as number) || 33;
  const lvVoltage = (metadata?.lvVoltage as number) || 11;
  const mva = metadata?.mva as number | undefined;
  const hvColor = VOLTAGE_COLORS[hvVoltage] || '#94A3B8';
  const lvColor = VOLTAGE_COLORS[lvVoltage] || '#94A3B8';
  const r = 18;

  return (
    <g key={el.id}>
      <line x1={x} y1={y - r * 2 - 5} x2={x} y2={y - r + 2} stroke="#94A3B8" strokeWidth={2} />
      <line x1={x} y1={y + r - 2} x2={x} y2={y + r * 2 + 5} stroke="#94A3B8" strokeWidth={2} />
      <circle cx={x} cy={y - r / 2} r={r} fill="none" stroke={hvColor} strokeWidth={2} />
      <circle cx={x} cy={y + r / 2} r={r} fill="none" stroke={lvColor} strokeWidth={2} />
      {label && (
        <text x={x + r + 8} y={y - 2} className="text-[9px] fill-gray-300 font-medium">{label}</text>
      )}
      {mva && (
        <text x={x + r + 8} y={y + 10} className="text-[8px] fill-gray-500">{mva} MVA</text>
      )}
      <text x={x - r - 8} y={y - r / 2} textAnchor="end" className="text-[7px] fill-gray-500">
        {hvVoltage}kV
      </text>
      <text x={x - r - 8} y={y + r / 2} textAnchor="end" className="text-[7px] fill-gray-500">
        {lvVoltage}kV
      </text>
    </g>
  );
}

function renderCurrentTransformer(el: SLDElement) {
  const { x, y } = el;
  return (
    <g key={el.id}>
      <line x1={x} y1={y - 8} x2={x} y2={y + 8} stroke="#94A3B8" strokeWidth={2} />
      <circle cx={x} cy={y} r={5} fill="none" stroke="#94A3B8" strokeWidth={1.5} />
    </g>
  );
}

function renderPotentialTransformer(el: SLDElement) {
  const { x, y } = el;
  return (
    <g key={el.id}>
      <line x1={x} y1={y - 8} x2={x} y2={y - 3} stroke="#94A3B8" strokeWidth={2} />
      <circle cx={x} cy={y - 3} r={4} fill="none" stroke="#94A3B8" strokeWidth={1.5} />
      <circle cx={x} cy={y + 3} r={4} fill="none" stroke="#94A3B8" strokeWidth={1.5} />
      <line x1={x} y1={y + 7} x2={x} y2={y + 12} stroke="#94A3B8" strokeWidth={2} />
    </g>
  );
}

function renderBusBar(el: SLDElement) {
  const { x, y, label, metadata } = el;
  const busWidth = (metadata?.busWidth as number) || 300;
  const voltageKv = (metadata?.voltageKv as number) || 11;
  const color = VOLTAGE_COLORS[voltageKv] || VOLTAGE_COLORS[0] || '#94A3B8';

  return (
    <g key={el.id}>
      <line
        x1={x} y1={y} x2={x + busWidth} y2={y}
        stroke={color} strokeWidth={6} strokeLinecap="round"
      />
      {label && (
        <text x={x + busWidth / 2} y={y - 10} textAnchor="middle" className="text-[9px] fill-gray-400">
          {label}
        </text>
      )}
    </g>
  );
}

function renderFeederLine(el: SLDElement) {
  const { x, y, label, metadata } = el;
  const voltageKv = (metadata?.voltageKv as number) || 11;
  const color = VOLTAGE_COLORS[voltageKv] || '#94A3B8';

  return (
    <g key={el.id}>
      <line x1={x} y1={y} x2={x} y2={y + 30} stroke={color} strokeWidth={2} />
      <polygon points={`${x},${y + 30} ${x - 4},${y + 22} ${x + 4},${y + 22}`} fill={color} />
      {label && (
        <text x={x} y={y + 44} textAnchor="middle" className="text-[8px] fill-gray-300 font-medium">
          {label}
        </text>
      )}
    </g>
  );
}

function renderLightningArrester(el: SLDElement) {
  const { x, y } = el;
  const color = '#94A3B8';
  return (
    <g key={el.id}>
      <line x1={x} y1={y - 10} x2={x} y2={y - 4} stroke="#94A3B8" strokeWidth={1.5} />
      <polyline
        points={`${x},${y - 4} ${x - 4},${y} ${x + 4},${y + 4} ${x - 4},${y + 8} ${x},${y + 12}`}
        fill="none" stroke={color} strokeWidth={1.5}
      />
      <line x1={x - 5} y1={y + 14} x2={x + 5} y2={y + 14} stroke={color} strokeWidth={1.5} />
      <line x1={x - 3} y1={y + 17} x2={x + 3} y2={y + 17} stroke={color} strokeWidth={1.5} />
    </g>
  );
}

function renderCapacitorBank(el: SLDElement) {
  const { x, y, label } = el;
  const color = '#16A34A';
  return (
    <g key={el.id}>
      <line x1={x} y1={y - 10} x2={x} y2={y - 3} stroke="#94A3B8" strokeWidth={1.5} />
      <line x1={x - 8} y1={y - 3} x2={x + 8} y2={y - 3} stroke={color} strokeWidth={2} />
      <line x1={x - 8} y1={y + 3} x2={x + 8} y2={y + 3} stroke={color} strokeWidth={2} />
      <line x1={x} y1={y + 3} x2={x} y2={y + 10} stroke="#94A3B8" strokeWidth={1.5} />
      {label && (
        <text x={x} y={y + 22} textAnchor="middle" className="text-[7px] fill-gray-500">{label}</text>
      )}
    </g>
  );
}

function renderElement(el: SLDElement) {
  switch (el.type) {
    case 'CIRCUIT_BREAKER': return renderCircuitBreaker(el);
    case 'ISOLATOR': return renderIsolator(el);
    case 'EARTH_SWITCH': return renderEarthSwitch(el);
    case 'POWER_TRANSFORMER': return renderPowerTransformer(el);
    case 'CURRENT_TRANSFORMER': return renderCurrentTransformer(el);
    case 'POTENTIAL_TRANSFORMER': return renderPotentialTransformer(el);
    case 'BUS_BAR': return renderBusBar(el);
    case 'FEEDER_LINE': return renderFeederLine(el);
    case 'LIGHTNING_ARRESTER': return renderLightningArrester(el);
    case 'CAPACITOR_BANK': return renderCapacitorBank(el);
    default: return null;
  }
}

function getElementCenter(el: SLDElement): { x: number; y: number } {
  if (el.type === 'BUS_BAR') {
    const busWidth = (el.metadata?.busWidth as number) || 300;
    return { x: el.x + busWidth / 2, y: el.y };
  }
  return { x: el.x, y: el.y };
}

function getConnectionPoint(
  el: SLDElement,
  point: string,
): { x: number; y: number } {
  const center = getElementCenter(el);
  const offset = 20;

  switch (point) {
    case 'top': return { x: center.x, y: el.y - offset };
    case 'bottom':
      if (el.type === 'POWER_TRANSFORMER') return { x: el.x, y: el.y + 41 };
      return { x: center.x, y: el.y + offset };
    case 'left': return { x: el.x - offset, y: el.y };
    case 'right':
      if (el.type === 'BUS_BAR') {
        const busWidth = (el.metadata?.busWidth as number) || 300;
        return { x: el.x + busWidth + offset, y: el.y };
      }
      return { x: el.x + offset, y: el.y };
    default: return center;
  }
}

function renderConnection(conn: SLDConnection, elementsById: Map<string, SLDElement>) {
  const fromEl = elementsById.get(conn.fromElementId);
  const toEl = elementsById.get(conn.toElementId);
  if (!fromEl || !toEl) return null;

  const from = getConnectionPoint(fromEl, conn.fromPoint);
  const to = getConnectionPoint(toEl, conn.toPoint);
  const color = getVoltageColor(conn.voltageLevel);

  return (
    <line
      key={conn.id}
      x1={from.x} y1={from.y}
      x2={to.x} y2={to.y}
      stroke={color} strokeWidth={2}
    />
  );
}

export default function DynamicSLDRenderer({ layout }: Props) {
  const elementsById = new Map(layout.elements.map((el) => [el.id, el]));

  return (
    <svg width="100%" viewBox={`0 0 ${layout.width} ${layout.height}`} className="rounded-xl">
      <defs>
        <pattern id="gen-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.3" />
        </pattern>
      </defs>

      <rect width={layout.width} height={layout.height} fill="#0B1120" />
      <rect width={layout.width} height={layout.height} fill="url(#gen-grid)" />

      {/* Title */}
      <text x={layout.width / 2} y={24} textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="600">
        {layout.name} (AI-Generated)
      </text>

      {/* Connections first (behind elements) */}
      {layout.connections.map((conn) => renderConnection(conn, elementsById))}

      {/* Equipment elements */}
      {layout.elements.map((el) => renderElement(el))}

      {/* Voltage legend */}
      <g transform={`translate(30, ${layout.height - 40})`}>
        <text x="0" y="0" fill="#64748B" fontSize="8" fontWeight="600">VOLTAGE COLORS:</text>
        {Object.entries(VOLTAGE_COLORS)
          .filter(([kv]) => Number(kv) > 0)
          .map(([kv, color], i) => (
            <g key={kv} transform={`translate(${i * 80}, 0)`}>
              <line x1={0} y1={12} x2={20} y2={12} stroke={color} strokeWidth={3} />
              <text x={25} y={15} fill="#6B7280" fontSize="7">{kv} kV</text>
            </g>
          ))}
      </g>
    </svg>
  );
}
