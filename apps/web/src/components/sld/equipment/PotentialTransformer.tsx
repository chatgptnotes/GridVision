interface Props {
  x: number;
  y: number;
  voltageColor?: string;
}

export default function PotentialTransformer({ x, y, voltageColor = '#94A3B8' }: Props) {
  return (
    <g>
      <line x1={x} y1={y - 8} x2={x} y2={y - 3} stroke="#94A3B8" strokeWidth={2} />
      <circle cx={x} cy={y - 3} r={4} fill="none" stroke={voltageColor} strokeWidth={1.5} />
      <circle cx={x} cy={y + 3} r={4} fill="none" stroke={voltageColor} strokeWidth={1.5} />
      <line x1={x} y1={y + 3 + 4} x2={x} y2={y + 12} stroke="#94A3B8" strokeWidth={2} />
    </g>
  );
}
