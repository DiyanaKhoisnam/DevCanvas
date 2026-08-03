import React, { useState } from 'react';
import {
  Globe,
  ShieldCheck,
  Server,
  Database,
  Zap,
  Layers,
  HardDrive,
  Lock,
  Search,
  Plus,
  X,
} from 'lucide-react';
import { ComponentTier } from '../../types';

interface ComponentTemplate {
  tier: ComponentTier;
  label: string;
  technology: string;
  icon: React.ReactNode;
  color: string;
  defaultCost: number;
}

const componentLibrary: ComponentTemplate[] = [
  {
    tier: 'FRONTEND',
    label: 'React Web Client',
    technology: 'React / Next.js',
    icon: <Globe className="w-4 h-4 text-blue-400" />,
    color: 'border-blue-500/30 hover:border-blue-500/60 bg-blue-950/20',
    defaultCost: 15,
  },
  {
    tier: 'GATEWAY',
    label: 'API Gateway',
    technology: 'Kong / NGINX / AWS API',
    icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    color: 'border-purple-500/30 hover:border-purple-500/60 bg-purple-950/20',
    defaultCost: 40,
  },
  {
    tier: 'BACKEND',
    label: 'Microservice API',
    technology: 'Node.js Express / Go / Java',
    icon: <Server className="w-4 h-4 text-emerald-400" />,
    color: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/20',
    defaultCost: 35,
  },
  {
    tier: 'DATABASE',
    label: 'PostgreSQL Relational DB',
    technology: 'PostgreSQL 16',
    icon: <Database className="w-4 h-4 text-amber-400" />,
    color: 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/20',
    defaultCost: 75,
  },
  {
    tier: 'CACHE',
    label: 'Redis Cache Cluster',
    technology: 'Redis 7',
    icon: <Zap className="w-4 h-4 text-rose-400" />,
    color: 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/20',
    defaultCost: 25,
  },
  {
    tier: 'QUEUE',
    label: 'Message Queue / Bus',
    technology: 'RabbitMQ / Kafka / SQS',
    icon: <Layers className="w-4 h-4 text-cyan-400" />,
    color: 'border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-950/20',
    defaultCost: 30,
  },
  {
    tier: 'STORAGE',
    label: 'Object Storage',
    technology: 'Amazon S3 / MinIO',
    icon: <HardDrive className="w-4 h-4 text-indigo-400" />,
    color: 'border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-950/20',
    defaultCost: 10,
  },
  {
    tier: 'SECURITY',
    label: 'Auth / OAuth Server',
    technology: 'Auth0 / Keycloak',
    icon: <Lock className="w-4 h-4 text-emerald-400" />,
    color: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/20',
    defaultCost: 20,
  },
];

interface Props {
  onAddNode: (tier: ComponentTier, label: string, tech: string, cost: number) => void;
}

export const LibraryPanel: React.FC<Props> = ({ onAddNode }) => {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  const filteredComponents = componentLibrary.filter(item => {
    const matchesSearch =
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.technology.toLowerCase().includes(search.toLowerCase()) ||
      item.tier.toLowerCase().includes(search.toLowerCase());

    const matchesTier = selectedTier === 'ALL' || item.tier === selectedTier;

    return matchesSearch && matchesTier;
  });

  const onDragStart = (event: React.DragEvent, item: ComponentTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 glass-panel border-r border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto z-10 select-none">
      <div>
        <h2 id="library-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          Component Palette
        </h2>
        <p className="text-[11px] text-slate-500">Drag items to canvas or click + to insert.</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter components..."
          aria-label="Filter components search"
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tier Filters */}
      <div className="flex flex-wrap gap-1">
        {['ALL', 'FRONTEND', 'BACKEND', 'DATABASE', 'QUEUE'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedTier(cat)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
              selectedTier === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Component List */}
      <div className="flex flex-col gap-2.5">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No matching components found.
          </div>
        ) : (
          filteredComponents.map((item, index) => (
            <div
              key={index}
              draggable
              onDragStart={e => onDragStart(e, item)}
              className={`p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all flex items-center justify-between group ${item.color}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">{item.icon}</div>
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400">{item.technology}</div>
                </div>
              </div>

              <button
                onClick={() => onAddNode(item.tier, item.label, item.technology, item.defaultCost)}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-blue-600 text-slate-400 hover:text-white transition-colors"
                title={`Add ${item.label} to canvas`}
                aria-label={`Add ${item.label} to canvas`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
