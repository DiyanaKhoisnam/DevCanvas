import React, { useState, useEffect } from 'react';
import { Trash2, Cpu, Server, DollarSign, Globe, Code, Shield } from 'lucide-react';
import { useCanvasStore } from '../../stores/useCanvasStore';
import { ComponentTier } from '../../types';

export const PropertyInspector: React.FC = () => {
  const { selectedNodeId, selectedEdgeId, nodes, edges, updateNodeData, deleteNode, setEdges } = useCanvasStore();

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedEdge = edges.find(e => e.id === selectedEdgeId);

  const [label, setLabel] = useState('');
  const [tier, setTier] = useState<ComponentTier>('BACKEND');
  const [technology, setTechnology] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState<number | ''>('');
  const [costEstimate, setCostEstimate] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [edgeProtocol, setEdgeProtocol] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label || '');
      setTier(selectedNode.data.tier || 'BACKEND');
      setTechnology(selectedNode.data.technology || '');
      setHost(selectedNode.data.host || '');
      setPort(selectedNode.data.port || '');
      setCostEstimate(selectedNode.data.costEstimate || '');
      setDescription(selectedNode.data.description || '');
    }
  }, [selectedNodeId, selectedNode]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeProtocol((selectedEdge.data?.protocol as string) || selectedEdge.label || 'HTTPS');
    }
  }, [selectedEdgeId, selectedEdge]);

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-80 glass-panel border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center z-10">
        <Cpu className="w-10 h-10 text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">No Component Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
          Click on any node or connection line to inspect and customize properties.
        </p>
      </div>
    );
  }

  if (selectedEdge) {
    const handleEdgeProtocolChange = (val: string) => {
      setEdgeProtocol(val);
      setEdges(
        edges.map(e =>
          e.id === selectedEdge.id
            ? { ...e, label: val, data: { ...e.data, protocol: val } }
            : e
        )
      );
    };

    return (
      <div className="w-80 glass-panel border-l border-slate-800 p-5 flex flex-col gap-5 overflow-y-auto z-10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100">Connection Link</h2>
          </div>
          <button
            onClick={() => setEdges(edges.filter(e => e.id !== selectedEdge.id))}
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors"
            title="Delete Edge"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Protocol / Label</label>
          <input
            type="text"
            value={edgeProtocol}
            onChange={e => handleEdgeProtocolChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
            placeholder="HTTPS / gRPC / TCP 5432"
          />
        </div>
      </div>
    );
  }

  const handleFieldSave = (key: string, value: any) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, { [key]: value });
    }
  };

  return (
    <div className="w-80 glass-panel border-l border-slate-800 p-5 flex flex-col gap-5 overflow-y-auto z-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-slate-100">Component Settings</h2>
        </div>
        <button
          onClick={() => deleteNode(selectedNode!.id)}
          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors"
          title="Delete Component"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Label */}
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Component Name</label>
        <input
          type="text"
          value={label}
          onChange={e => {
            setLabel(e.target.value);
            handleFieldSave('label', e.target.value);
          }}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Tier */}
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Architecture Tier</label>
        <select
          value={tier}
          onChange={e => {
            const newTier = e.target.value as ComponentTier;
            setTier(newTier);
            handleFieldSave('tier', newTier);
          }}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
        >
          <option value="FRONTEND">FRONTEND</option>
          <option value="GATEWAY">GATEWAY</option>
          <option value="BACKEND">BACKEND</option>
          <option value="DATABASE">DATABASE</option>
          <option value="CACHE">CACHE</option>
          <option value="QUEUE">QUEUE</option>
          <option value="STORAGE">STORAGE</option>
          <option value="SECURITY">SECURITY</option>
        </select>
      </div>

      {/* Technology */}
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-purple-400" />
          Tech Stack
        </label>
        <input
          type="text"
          value={technology}
          onChange={e => {
            setTechnology(e.target.value);
            handleFieldSave('technology', e.target.value);
          }}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
          placeholder="React, Go, PostgreSQL 16..."
        />
      </div>

      {/* Host & Port */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-cyan-400" />
            Host
          </label>
          <input
            type="text"
            value={host}
            onChange={e => {
              setHost(e.target.value);
              handleFieldSave('host', e.target.value);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
            placeholder="api.internal"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Port</label>
          <input
            type="number"
            value={port}
            onChange={e => {
              const p = e.target.value ? Number(e.target.value) : '';
              setPort(p);
              handleFieldSave('port', p);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
            placeholder="8080"
          />
        </div>
      </div>

      {/* Monthly Cost */}
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          Est. Monthly Cost ($)
        </label>
        <input
          type="number"
          value={costEstimate}
          onChange={e => {
            const c = e.target.value ? Number(e.target.value) : '';
            setCostEstimate(c);
            handleFieldSave('costEstimate', c);
          }}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-300 font-mono focus:outline-none focus:border-blue-500"
          placeholder="45"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-slate-400 mb-1 block">Notes / Description</label>
        <textarea
          value={description}
          onChange={e => {
            setDescription(e.target.value);
            handleFieldSave('description', e.target.value);
          }}
          rows={3}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          placeholder="Service documentation & responsibilities..."
        />
      </div>
    </div>
  );
};
