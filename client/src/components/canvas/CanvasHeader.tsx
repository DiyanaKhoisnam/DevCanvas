import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Download,
  Layout,
  Save,
  ArrowLeft,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useCanvasStore } from '../../stores/useCanvasStore';
import { useUIStore } from '../../stores/useUIStore';
import { api } from '../../services/api';
import dagre from 'dagre';
import { ArchitectureNode, ArchitectureEdge } from '../../types';

interface Props {
  projectId?: string;
  projectTitle: string;
  onTitleChange: (newTitle: string) => void;
  onBack: () => void;
}

export const CanvasHeader: React.FC<Props> = ({ projectId, projectTitle, onTitleChange, onBack }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(projectTitle);

  const {
    nodes,
    edges,
    undo,
    redo,
    undoStack,
    redoStack,
    healthScore,
    setValidationResults,
    autoLayoutNodes,
    isSaving,
    setIsSaving,
    setLastSavedAt,
  } = useCanvasStore();

  const {
    theme,
    toggleTheme,
    isDataFlowSimulating,
    setDataFlowSimulating,
    setValidationDrawerOpen,
    isValidationDrawerOpen,
    setExportModalOpen,
  } = useUIStore();

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput !== projectTitle) {
      onTitleChange(titleInput.trim());
    }
  };

  const handleSave = async () => {
    if (!projectId) return;
    try {
      setIsSaving(true);
      await api.put(`/diagrams/${projectId}`, {
        nodes,
        edges,
        viewport: { x: 0, y: 0, zoom: 1 },
      });
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Failed to save diagram', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunValidation = async () => {
    try {
      const res = await api.post('/diagrams/validate', { nodes, edges });
      setValidationResults(res.data.healthScore, res.data.issues);
      setValidationDrawerOpen(true);
    } catch (e) {
      console.error('Validation failed', e);
    }
  };

  const handleAutoLayout = () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 100 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach(node => {
      g.setNode(node.id, { width: node.width || 220, height: node.height || 100 });
    });

    edges.forEach(edge => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const layoutedNodes: ArchitectureNode[] = nodes.map(node => {
      const nodeWithPosition = g.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - (node.width || 220) / 2,
          y: nodeWithPosition.y - (node.height || 100) / 2,
        },
      };
    });

    autoLayoutNodes(layoutedNodes);
  };

  return (
    <header className="h-16 px-4 glass-panel border-b border-slate-800 flex items-center justify-between z-20">
      {/* Left section: Back button & Project Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="h-5 w-[1px] bg-slate-800" />

        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={e => e.key === 'Enter' && handleTitleSubmit()}
            className="bg-slate-900 border border-blue-500 rounded px-2.5 py-1 text-sm font-semibold text-slate-100 focus:outline-none"
            autoFocus
          />
        ) : (
          <h1
            onClick={() => setIsEditingTitle(true)}
            className="text-base font-bold text-slate-100 hover:bg-slate-800/40 px-2 py-1 rounded cursor-pointer transition-colors"
          >
            {projectTitle}
          </h1>
        )}

        <span className="text-xs text-slate-500 font-medium">
          {isSaving ? 'Saving...' : 'Saved'}
        </span>
      </div>

      {/* Center section: Undo/Redo & Layout actions */}
      <div className="flex items-center gap-1.5 bg-slate-900/70 p-1 rounded-xl border border-slate-800">
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-1" />

        <button
          onClick={handleAutoLayout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          title="Auto Layout Diagram"
        >
          <Layout className="w-3.5 h-3.5 text-blue-400" />
          Auto Layout
        </button>

        <button
          onClick={() => setDataFlowSimulating(!isDataFlowSimulating)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isDataFlowSimulating ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Simulate Data Packets"
        >
          {isDataFlowSimulating ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
          {isDataFlowSimulating ? 'Simulating...' : 'Simulate'}
        </button>
      </div>

      {/* Right section: Health Score, Validation & Export */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleRunValidation}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            healthScore >= 90
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
          }`}
        >
          {healthScore >= 90 ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
          <span>Health: {healthScore}/100</span>
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold transition-colors"
        >
          <Save className="w-3.5 h-3.5 text-blue-400" />
          Save
        </button>

        <button
          onClick={() => setExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
