import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
} from '@xyflow/react';
import { ArchitectureNode, ArchitectureEdge, ValidationIssue } from '../types';

interface HistoryState {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

interface CanvasState {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  viewport: { x: number; y: number; zoom: number };
  healthScore: number;
  validationIssues: ValidationIssue[];
  isSaving: boolean;
  lastSavedAt: string | null;

  // History stack (Undo / Redo)
  undoStack: HistoryState[];
  redoStack: HistoryState[];

  setNodes: (nodes: ArchitectureNode[]) => void;
  setEdges: (edges: ArchitectureEdge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: ArchitectureNode) => void;
  updateNodeData: (id: string, data: Partial<ArchitectureNode['data']>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  setValidationResults: (score: number, issues: ValidationIssue[]) => void;
  setIsSaving: (isSaving: boolean) => void;
  setLastSavedAt: (time: string) => void;

  undo: () => void;
  redo: () => void;
  saveHistorySnapshot: () => void;
  autoLayoutNodes: (formattedNodes: ArchitectureNode[]) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  viewport: { x: 0, y: 0, zoom: 1 },
  healthScore: 100,
  validationIssues: [],
  isSaving: false,
  lastSavedAt: null,
  undoStack: [],
  redoStack: [],

  setNodes: nodes => set({ nodes }),
  setEdges: edges => set({ edges }),

  saveHistorySnapshot: () => {
    const { nodes, edges, undoStack } = get();
    const snapshot: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    set({
      undoStack: [...undoStack.slice(-30), snapshot], // Limit history to 30 states
      redoStack: [],
    });
  },

  onNodesChange: changes => {
    set({
      nodes: applyNodeChanges(changes, get().nodes as any) as ArchitectureNode[],
    });
  },

  onEdgesChange: changes => {
    set({
      edges: applyEdgeChanges(changes, get().edges as any) as ArchitectureEdge[],
    });
  },

  onConnect: connection => {
    get().saveHistorySnapshot();
    const newEdge: ArchitectureEdge = {
      id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle || undefined,
      targetHandle: connection.targetHandle || undefined,
      type: 'customDataEdge',
      animated: true,
      data: { protocol: 'HTTPS', isEncrypted: true },
    };
    set({
      edges: addEdge(newEdge as any, get().edges as any) as ArchitectureEdge[],
    });
  },

  addNode: node => {
    get().saveHistorySnapshot();
    set({
      nodes: [...get().nodes, node],
      selectedNodeId: node.id,
    });
  },

  updateNodeData: (id, data) => {
    get().saveHistorySnapshot();
    set({
      nodes: get().nodes.map(n => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
    });
  },

  deleteNode: id => {
    get().saveHistorySnapshot();
    set({
      nodes: get().nodes.filter(n => n.id !== id),
      edges: get().edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  selectNode: id => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: id => set({ selectedEdgeId: id, selectedNodeId: null }),
  setViewport: viewport => set({ viewport }),

  setValidationResults: (healthScore, validationIssues) => set({ healthScore, validationIssues }),
  setIsSaving: isSaving => set({ isSaving }),
  setLastSavedAt: time => set({ lastSavedAt: time }),

  undo: () => {
    const { undoStack, redoStack, nodes, edges } = get();
    if (undoStack.length === 0) return;

    const previousState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    const currentSnapshot: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };

    set({
      nodes: previousState.nodes,
      edges: previousState.edges,
      undoStack: newUndoStack,
      redoStack: [...redoStack, currentSnapshot],
    });
  },

  redo: () => {
    const { undoStack, redoStack, nodes, edges } = get();
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    const currentSnapshot: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };

    set({
      nodes: nextState.nodes,
      edges: nextState.edges,
      undoStack: [...undoStack, currentSnapshot],
      redoStack: newRedoStack,
    });
  },

  autoLayoutNodes: formattedNodes => {
    get().saveHistorySnapshot();
    set({ nodes: formattedNodes });
  },
}));
