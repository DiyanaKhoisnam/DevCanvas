import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Trash2 } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';
import { useCanvasStore } from '../../stores/useCanvasStore';

export const Toolbar: React.FC = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { setNodes, setEdges, saveHistorySnapshot } = useCanvasStore();

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear the entire canvas?')) {
      saveHistorySnapshot();
      setNodes([]);
      setEdges([]);
    }
  };

  return (
    <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
      <button
        onClick={() => zoomIn()}
        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={() => zoomOut()}
        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={() => fitView({ padding: 0.2 })}
        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        title="Fit View to Elements"
      >
        <Maximize className="w-4 h-4" />
      </button>

      <div className="h-4 w-[1px] bg-slate-800 mx-1" />

      <button
        onClick={handleClearAll}
        className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors"
        title="Clear Entire Canvas"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
