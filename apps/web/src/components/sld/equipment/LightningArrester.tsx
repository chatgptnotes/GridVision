interface Props {
  x: number;
  y: number;
  voltageColor?: string;
}

export default function LightningArrester({ x, y, voltageColor = '#94A3B8' }: Props) {
  return (
    <g>
      <line x1={x} y1={y - 10} x2={x} y2={y - 4} stroke="#94A3B8" strokeWidth={1.5} />
      {/* Zigzag */}
      <polyline
        points={`${x},${y - 4} ${x - 4},${y} ${x + 4},${y + 4} ${x - 4},${y + 8} ${x},${y + 12}`}
        fill="none"
        stroke={voltageColor}
        strokeWidth={1.5}
      />
      {/* Ground */}
      <line x1={x - 5} y1={y + 14} x2={x + 5} y2={y + 14} stroke={voltageColor} strokeWidth={1.5} />
      <line x1={x - 3} y1={y + 17} x2={x + 3} y2={y + 17} stroke={voltageColor} strokeWidth={1.5} />
    </g>
  );
}
