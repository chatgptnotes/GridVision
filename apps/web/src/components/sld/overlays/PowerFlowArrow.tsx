interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  direction: 'forward' | 'reverse';
  color?: string;
}

export default function PowerFlowArrow({ x1, y1, x2, y2, direction, color = '#3B82F6' }: Props) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  const rotation = direction === 'reverse' ? angle + 180 : angle;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} opacity={0.3} />
      <polygon
        points="0,-3 8,0 0,3"
        fill={color}
        opacity={0.7}
        transform={`translate(${midX}, ${midY}) rotate(${rotation})`}
      />
    </g>
  );
}
