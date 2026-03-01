interface Props {
  x: number;
  y: number;
  label?: string;
  connected?: boolean;
}

export default function CapacitorBank({ x, y, label, connected = true }: Props) {
  const color = connected ? '#16A34A' : '#6B7280';

  return (
    <g>
      <line x1={x} y1={y - 10} x2={x} y2={y - 3} stroke="#94A3B8" strokeWidth={1.5} />
      {/* Capacitor plates */}
      <line x1={x - 8} y1={y - 3} x2={x + 8} y2={y - 3} stroke={color} strokeWidth={2} />
      <line x1={x - 8} y1={y + 3} x2={x + 8} y2={y + 3} stroke={color} strokeWidth={2} />
      <line x1={x} y1={y + 3} x2={x} y2={y + 10} stroke="#94A3B8" strokeWidth={1.5} />
      {label && (
        <text x={x} y={y + 22} textAnchor="middle" className="text-[7px] fill-gray-500">{label}</text>
      )}
    </g>
  );
}
