import { useState, useRef, useEffect, ReactNode } from 'react';
import { X, Pin, PinOff } from 'lucide-react';

interface BaseFaceplateProps {
  title: string;
  type: string;
  x: number;
  y: number;
  onClose: () => void;
  onPin?: () => void;
  pinned?: boolean;
  children: ReactNode;
  width?: number;
}

export default function BaseFaceplate({ title, type, x, y, onClose, onPin, pinned, children, width = 320 }: BaseFaceplateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: Math.min(x, window.innerWidth - width - 20), y: Math.min(y, window.innerHeight - 300) });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, dragStart]);

  return (
    <div
      ref={ref}
      className="fixed z-[45] bg-gray-900 border border-gray-600 rounded-lg shadow-2xl overflow-hidden"
      style={{ left: pos.x, top: pos.y, width }}
      onClick={e => e.stopPropagation()}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 cursor-move select-none border-b border-gray-700"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs font-bold text-white flex-1 truncate">{title}</span>
        <span className="text-[10px] text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">{type}</span>
        {onPin && (
          <button onClick={onPin} className="text-gray-400 hover:text-blue-400">
            {pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
        )}
        <button onClick={onClose} className="text-gray-400 hover:text-red-400">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 max-h-[400px] overflow-y-auto text-xs">
        {children}
      </div>
    </div>
  );
}
