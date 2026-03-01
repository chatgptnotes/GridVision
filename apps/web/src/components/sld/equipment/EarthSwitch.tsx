import { useDigitalState } from '@/hooks/useRealTimeData';

interface Props {
  x: number;
  y: number;
  tag: string;
}

export default function EarthSwitch({ x, y, tag }: Props) {
  const state = useDigitalState(`${tag}_STATUS`);
  const isClosed = state === true;
  const color = isClosed ? '#DC2626' : '#16A34A';

  return (
    <g>
      <line x1={x} y1={y - 8} x2={x} y2={y} stroke={color} strokeWidth={1.5} />
      {/* Ground symbol */}
      <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={color} strokeWidth={1.5} />
      <line x1={x - 4} y1={y + 3} x2={x + 4} y2={y + 3} stroke={color} strokeWidth={1.5} />
      <line x1={x - 2} y1={y + 6} x2={x + 2} y2={y + 6} stroke={color} strokeWidth={1.5} />
    </g>
  );
}
