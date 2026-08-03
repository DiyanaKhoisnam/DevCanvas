import React, { memo } from 'react';
import { getBezierPath, EdgeProps, EdgeLabelRenderer } from '@xyflow/react';
import { useUIStore } from '../../stores/useUIStore';

export const CustomDataEdge: React.FC<EdgeProps> = memo(
  ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, selected, data }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const isSimulating = useUIStore(state => state.isDataFlowSimulating);
    const protocol = (data?.protocol as string) || label || 'HTTPS';

    return (
      <>
        {/* Glowing background path on selection */}
        <path
          id={id}
          className={`react-flow__edge-path transition-all duration-200 ${
            selected ? 'stroke-blue-400 stroke-[3px]' : 'stroke-slate-600 stroke-[2px] hover:stroke-slate-400'
          }`}
          d={edgePath}
        />

        {/* Animated packet stream when simulation active or animated flag set */}
        {isSimulating && (
          <path
            className="stroke-cyan-400 stroke-[2px] [stroke-dasharray:6,6] animate-[dash_1s_linear_infinite]"
            d={edgePath}
            fill="none"
          />
        )}

        {/* Edge Label Badge */}
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-0.5 rounded-full text-[10px] font-mono text-cyan-300 shadow-md backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
              {protocol}
            </div>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }
);

CustomDataEdge.displayName = 'CustomDataEdge';
