import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  Globe,
  ShieldCheck,
  Server,
  Database,
  Zap,
  Layers,
  HardDrive,
  Lock,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { NodeData, ComponentTier } from '../../types';

const getTierColor = (tier: ComponentTier) => {
  switch (tier) {
    case 'FRONTEND':
      return { border: 'border-blue-500/50', bg: 'bg-blue-950/40', text: 'text-blue-400', iconBg: 'bg-blue-500/20' };
    case 'GATEWAY':
      return { border: 'border-purple-500/50', bg: 'bg-purple-950/40', text: 'text-purple-400', iconBg: 'bg-purple-500/20' };
    case 'BACKEND':
      return { border: 'border-emerald-500/50', bg: 'bg-emerald-950/40', text: 'text-emerald-400', iconBg: 'bg-emerald-500/20' };
    case 'DATABASE':
      return { border: 'border-amber-500/50', bg: 'bg-amber-950/40', text: 'text-amber-400', iconBg: 'bg-amber-500/20' };
    case 'CACHE':
      return { border: 'border-rose-500/50', bg: 'bg-rose-950/40', text: 'text-rose-400', iconBg: 'bg-rose-500/20' };
    case 'QUEUE':
      return { border: 'border-cyan-500/50', bg: 'bg-cyan-950/40', text: 'text-cyan-400', iconBg: 'bg-cyan-500/20' };
    case 'STORAGE':
      return { border: 'border-indigo-500/50', bg: 'bg-indigo-950/40', text: 'text-indigo-400', iconBg: 'bg-indigo-500/20' };
    default:
      return { border: 'border-slate-500/50', bg: 'bg-slate-950/40', text: 'text-slate-400', iconBg: 'bg-slate-500/20' };
  }
};

const getTierIcon = (tier: ComponentTier) => {
  switch (tier) {
    case 'FRONTEND':
      return <Globe className="w-5 h-5" />;
    case 'GATEWAY':
      return <ShieldCheck className="w-5 h-5" />;
    case 'BACKEND':
      return <Server className="w-5 h-5" />;
    case 'DATABASE':
      return <Database className="w-5 h-5" />;
    case 'CACHE':
      return <Zap className="w-5 h-5" />;
    case 'QUEUE':
      return <Layers className="w-5 h-5" />;
    case 'STORAGE':
      return <HardDrive className="w-5 h-5" />;
    case 'SECURITY':
      return <Lock className="w-5 h-5" />;
    default:
      return <Cloud className="w-5 h-5" />;
  }
};

export const ArchitectureNode: React.FC<any> = memo(({ data, selected }) => {
  const nodeData = data as NodeData;
  const colors = getTierColor(nodeData.tier || 'BACKEND');
  const icon = getTierIcon(nodeData.tier || 'BACKEND');

  const status = nodeData.status || 'active';

  return (
    <div
      className={`relative min-w-[220px] rounded-xl glass-panel p-3.5 transition-all duration-200 ${colors.bg} ${colors.border} ${
        selected ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/20 scale-[1.02]' : 'hover:border-slate-400/40'
      }`}
    >
      {/* Top handles */}
      <Handle type="target" position={Position.Top} id="top" className="!bg-blue-500" />

      {/* Header section */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${colors.iconBg} ${colors.text}`}>{icon}</div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{nodeData.tier}</div>
            <div className="text-sm font-bold text-slate-100 truncate max-w-[130px]">{nodeData.label}</div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1">
          {status === 'active' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {status === 'degraded' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
          {status === 'offline' && <XCircle className="w-4 h-4 text-rose-400" />}
        </div>
      </div>

      {/* Technology & Host preview */}
      {(nodeData.technology || nodeData.host) && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate max-w-[120px] font-mono text-slate-300">{nodeData.technology || nodeData.host}</span>
          {nodeData.costEstimate !== undefined && (
            <span className="font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
              ${nodeData.costEstimate}/mo
            </span>
          )}
        </div>
      )}

      {/* Left, Right, Bottom handles */}
      <Handle type="target" position={Position.Left} id="left" className="!bg-blue-500" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-blue-500" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-blue-500" />
    </div>
  );
});

ArchitectureNode.displayName = 'ArchitectureNode';
