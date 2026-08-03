import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  MiniMap,
  useReactFlow,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CanvasHeader } from '../components/canvas/CanvasHeader';
import { LibraryPanel } from '../components/canvas/LibraryPanel';
import { PropertyInspector } from '../components/canvas/PropertyInspector';
import { ValidationDrawer } from '../components/canvas/ValidationDrawer';
import { ExportModal } from '../components/canvas/ExportModal';
import { Toolbar } from '../components/canvas/Toolbar';
import { ArchitectureNode } from '../components/nodes/ArchitectureNode';
import { CustomDataEdge } from '../components/edges/CustomDataEdge';

import { useCanvasStore } from '../stores/useCanvasStore';
import { api } from '../services/api';
import { ComponentTier, ArchitectureNode as ArchitectureNodeType } from '../types';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

const nodeTypes = {
  architectureNode: ArchitectureNode,
};

const edgeTypes = {
  customDataEdge: CustomDataEdge,
};

interface Props {
  projectId: string;
  onBack: () => void;
}

const CanvasContent: React.FC<Props> = ({ projectId, onBack }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [isLoadingDiagram, setIsLoadingDiagram] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('Architecture Diagram');

  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    selectNode,
    selectEdge,
    setNodes,
    setEdges,
    setValidationResults,
  } = useCanvasStore();

  // Keyboard shortcut handlers (Delete, Backspace, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keypresses when typing in inputs/textareas
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        deleteNode(selectedNodeId);
      } else if (e.key === 'Escape') {
        selectNode(null);
        selectEdge(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, deleteNode, selectNode, selectEdge]);

  // Load Diagram data from API
  useEffect(() => {
    let isMounted = true;
    const loadDiagram = async () => {
      try {
        setIsLoadingDiagram(true);
        setLoadError(null);

        const projectRes = await api.get(`/projects/${projectId}`);
        if (!isMounted) return;

        if (projectRes.data.project) {
          setProjectTitle(projectRes.data.project.title);
        }

        const res = await api.get(`/diagrams/${projectId}`);
        if (!isMounted) return;

        if (res.data.diagram) {
          const loadedNodes = res.data.diagram.nodes || [];
          const loadedEdges = res.data.diagram.edges || [];
          setNodes(loadedNodes);
          setEdges(loadedEdges);

          // Run initial validation check
          if (loadedNodes.length > 0) {
            const valRes = await api.post('/diagrams/validate', {
              nodes: loadedNodes,
              edges: loadedEdges,
            });
            if (isMounted) {
              setValidationResults(valRes.data.healthScore, valRes.data.issues);
            }
          }
        }
      } catch (e: any) {
        if (isMounted) {
          setLoadError(e.response?.data?.error || 'Failed to load project architecture.');
        }
      } finally {
        if (isMounted) setIsLoadingDiagram(false);
      }
    };

    loadDiagram();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Handle Drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle Drop onto canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      const item = JSON.parse(rawData);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: ArchitectureNodeType = {
        id: `node-${Date.now()}`,
        type: 'architectureNode',
        position,
        data: {
          label: item.label,
          tier: item.tier as ComponentTier,
          technology: item.technology,
          costEstimate: item.defaultCost,
          status: 'active',
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const handleAddNodeFromCenter = (tier: ComponentTier, label: string, tech: string, cost: number) => {
    const newNode: ArchitectureNodeType = {
      id: `node-${Date.now()}`,
      type: 'architectureNode',
      position: { x: 400 + Math.random() * 50, y: 200 + Math.random() * 50 },
      data: {
        label,
        tier,
        technology: tech,
        costEstimate: cost,
        status: 'active',
      },
    };
    addNode(newNode);
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    selectNode(node.id);
  };

  const handleEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    selectEdge(edge.id);
  };

  const handlePaneClick = () => {
    selectNode(null);
    selectEdge(null);
  };

  if (loadError) {
    return (
      <div className="h-screen w-screen bg-[#0b0f17] flex flex-col items-center justify-center p-6 text-slate-100 text-center">
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 mb-4">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-lg font-bold text-slate-100 mb-1">Architecture Project Not Found</h2>
        <p className="text-xs text-slate-400 mb-6 max-w-sm">{loadError}</p>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0b0f17] overflow-hidden select-none">
      {/* Header */}
      <CanvasHeader
        projectId={projectId}
        projectTitle={projectTitle}
        onTitleChange={async newTitle => {
          setProjectTitle(newTitle);
          await api.put(`/projects/${projectId}`, { title: newTitle });
        }}
        onBack={onBack}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Component Library Palette */}
        <LibraryPanel onAddNode={handleAddNodeFromCenter} />

        {/* Center Interactive Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 h-full relative" onDrop={onDrop} onDragOver={onDragOver}>
          {isLoadingDiagram && (
            <div className="absolute inset-0 z-20 bg-[#0b0f17]/80 backdrop-blur-sm flex flex-col items-center justify-center text-slate-300">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <span className="text-xs font-semibold">Loading Architecture Diagram...</span>
            </div>
          )}

          <ReactFlow
            nodes={nodes as any}
            edges={edges as any}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={{ type: 'customDataEdge', animated: true }}
            fitView
            attributionPosition="bottom-right"
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#1f293d" />
            <MiniMap
              nodeColor={node => {
                const tier = (node.data as any)?.tier;
                if (tier === 'DATABASE') return '#f59e0b';
                if (tier === 'FRONTEND') return '#3b82f6';
                if (tier === 'GATEWAY') return '#a855f7';
                return '#10b981';
              }}
              maskColor="rgba(11, 15, 23, 0.7)"
            />
          </ReactFlow>

          {/* Floating Canvas Toolbar */}
          <Toolbar />
        </div>

        {/* Right Node & Edge Property Inspector */}
        <PropertyInspector />
      </div>

      {/* Bottom Diagnostics Drawer */}
      <ValidationDrawer />

      {/* Export & Code Generator Modal */}
      <ExportModal projectTitle={projectTitle} />
    </div>
  );
};

export const CanvasWorkspacePage: React.FC<Props> = props => (
  <ReactFlowProvider>
    <CanvasContent {...props} />
  </ReactFlowProvider>
);
