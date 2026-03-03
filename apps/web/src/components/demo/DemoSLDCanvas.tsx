import { useState, useCallback, useRef, useEffect, type MouseEvent } from 'react';
import DemoViewport from './DemoViewport';
import DemoLayout33_11kV from './DemoLayout33_11kV';

export default function DemoSLDCanvas() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Native wheel event for zoom (passive: false to prevent page scroll)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => {
        const next = prev * zoomFactor;
        return Math.max(0.3, Math.min(5, next));
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Left click or middle click to pan
    if (e.button === 0 || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    // Reset zoom and pan on double click
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden bg-white ${isPanning ? 'cursor-grabbing' : 'cursor-crosshair'}`}
      style={{
        touchAction: 'none',
        overscrollBehavior: 'contain',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Apply zoom/pan as CSS transform on wrapper div - this actually scales the SVG visually */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <DemoViewport>
          <DemoLayout33_11kV />
        </DemoViewport>
      </div>

      {/* Zoom level indicator */}
      {zoom !== 1 && (
        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md font-mono pointer-events-none">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
}
