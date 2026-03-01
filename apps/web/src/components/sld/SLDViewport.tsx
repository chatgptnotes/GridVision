import { ReactNode } from 'react';

interface Props {
  zoom: number;
  panX: number;
  panY: number;
  children: ReactNode;
}

export default function SLDViewport({ zoom, panX, panY, children }: Props) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 800"
      className="select-none"
    >
      <defs>
        {/* Grid pattern for SLD background */}
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Background grid */}
      <rect width="100%" height="100%" fill="#0F172A" />
      <rect width="100%" height="100%" fill="url(#grid)" />

      <g transform={`translate(${panX}, ${panY}) scale(${zoom})`}>
        {children}
      </g>
    </svg>
  );
}
