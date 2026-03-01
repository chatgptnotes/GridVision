interface Props {
  x: number;
  y: number;
  voltageColor?: string;
}

export default function CurrentTransformer({ x, y, voltageColor = '#94A3B8' }: Props) {
  return (
    <g>
      <line x1={x} y1={y - 8} x2={x} y2={y + 8} stroke="#94A3B8" strokeWidth={2} />
      <circle cx={x} cy={y} r={5} fill="none" stroke={voltageColor} strokeWidth={1.5} />
    </g>
  );
}
