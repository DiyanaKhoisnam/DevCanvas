import { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface ArchitectureNodePayload {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    tier: 'FRONTEND' | 'GATEWAY' | 'BACKEND' | 'DATABASE' | 'CACHE' | 'QUEUE' | 'STORAGE' | 'THIRD_PARTY' | 'SECURITY';
    technology?: string;
    description?: string;
    host?: string;
    port?: number;
    envVars?: Record<string, string>;
    costEstimate?: number;
    isHealthy?: boolean;
    [key: string]: any;
  };
  width?: number;
  height?: number;
}

export interface ArchitectureEdgePayload {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  type?: string;
  animated?: boolean;
  data?: {
    protocol?: string;
    isEncrypted?: boolean;
    authRequired?: boolean;
    [key: string]: any;
  };
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
