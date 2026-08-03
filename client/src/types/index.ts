export type ComponentTier =
  | 'FRONTEND'
  | 'GATEWAY'
  | 'BACKEND'
  | 'DATABASE'
  | 'CACHE'
  | 'QUEUE'
  | 'STORAGE'
  | 'THIRD_PARTY'
  | 'SECURITY';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
}

export interface NodeData {
  label: string;
  tier: ComponentTier;
  technology?: string;
  description?: string;
  host?: string;
  port?: number;
  envVars?: Record<string, string>;
  costEstimate?: number;
  isHealthy?: boolean;
  status?: 'active' | 'degraded' | 'offline';
  [key: string]: any;
}

export interface ArchitectureNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
  width?: number;
  height?: number;
  selected?: boolean;
}

export interface EdgeData {
  protocol?: string;
  isEncrypted?: boolean;
  authRequired?: boolean;
  bandwidth?: string;
  [key: string]: any;
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  type?: string;
  animated?: boolean;
  data?: EdgeData;
  selected?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description?: string;
  visibility: 'PRIVATE' | 'PUBLIC' | 'SHARED';
  tags: string[];
  thumbnail?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  diagram?: {
    updatedAt: string;
  };
}

export interface DiagramPayload {
  id?: string;
  projectId: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  viewport: { x: number; y: number; zoom: number };
  settings: Record<string, any>;
  version?: number;
}

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  title: string;
  message: string;
  nodeIds: string[];
  edgeIds: string[];
  recommendation?: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  category: ComponentTier;
  thumbnail?: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  isOfficial: boolean;
}
