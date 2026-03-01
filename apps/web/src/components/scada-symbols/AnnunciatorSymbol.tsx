import React from 'react';

interface AnnunciatorSymbolProps {
  width?: number;
  height?: number;
  windows?: number;
  activeWindows?: number[];
  color?: string;
  onClick?: () => void;
  label?: string;
}

export default function AnnunciatorSymbol({
  width = 100,
  height = 60,
  windows = 8,
  activeWindows = [],
  color,
  onClick,
  label,
}: AnnunciatorSymbolProps) {
  const cols = 4;
  const rows = Math.ceil(windows / cols);

  const borderColor = '#475569';
  const strokeWidth = 2;
  const textColor = '#1E293B';

  // Grid layout constants
  const panelX = 6;
  const panelY = 4;
  const panelWidth = 88;
  const panelHeight = rows * 18 + 6;
  const cellWidth = 18;
  const cellHeight = 14;
  const cellGapX = 3;
  const cellGapY = 3;
  const gridStartX = panelX + (panelWidth - cols * cellWidth - (cols - 1) * cellGapX) / 2;
  const gridStartY = panelY + 4;

  const activeColor = color || '#DC2626';
  const normalColor = '#D1D5DB';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 60"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="img"
      aria-label={
        label ||
        `Alarm Annunciator (${activeWindows.length} active of ${windows} windows)`
      }
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Annunciator alarm flash animation */}
      <style>
        {`
          @keyframes annunciator-alarm {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .annunciator-active {
            animation: annunciator-alarm 0.7s ease-in-out infinite;
          }
        `}
      </style>

      {/* Panel enclosure */}
      <rect
        x={panelX}
        y={panelY}
        width={panelWidth}
        height={panelHeight}
        rx={3}
        fill="#F8FAFC"
        stroke={borderColor}
        strokeWidth={strokeWidth}
      />

      {/* Window grid */}
      {Array.from({ length: windows }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gridStartX + col * (cellWidth + cellGapX);
        const y = gridStartY + row * (cellHeight + cellGapY);
        const isActive = activeWindows.includes(i);

        return (
          <g key={i}>
            {/* Window glow for active alarms */}
            {isActive && (
              <rect
                x={x - 1.5}
                y={y - 1.5}
                width={cellWidth + 3}
                height={cellHeight + 3}
                rx={2}
                fill={activeColor}
                fillOpacity={0.2}
                className="annunciator-active"
              />
            )}

            {/* Window rectangle */}
            <rect
              className={isActive ? 'annunciator-active' : undefined}
              x={x}
              y={y}
              width={cellWidth}
              height={cellHeight}
              rx={1.5}
              fill={isActive ? activeColor : normalColor}
              fillOpacity={isActive ? 0.85 : 0.5}
              stroke={isActive ? activeColor : '#9CA3AF'}
              strokeWidth={1}
            />

            {/* Window number */}
            <text
              x={x + cellWidth / 2}
              y={y + cellHeight / 2 + 3}
              textAnchor="middle"
              fill={isActive ? '#FFFFFF' : '#6B7280'}
              fontSize={7}
              fontFamily="Arial, sans-serif"
              fontWeight={isActive ? '700' : '500'}
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Label text */}
      <text
        x={50}
        y={56}
        textAnchor="middle"
        fill={textColor}
        fontSize={7}
        fontFamily="Arial, sans-serif"
        fontWeight="600"
      >
        {label || 'ANNUNCIATOR'}
      </text>
    </svg>
  );
}
