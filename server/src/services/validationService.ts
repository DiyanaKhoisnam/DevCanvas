import { ArchitectureNodePayload, ArchitectureEdgePayload, ValidationIssue } from '../types';

export class ArchitectureValidationService {
  public static validate(nodes: ArchitectureNodePayload[], edges: ArchitectureEdgePayload[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    const nodeMap = new Map<string, ArchitectureNodePayload>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    const outgoingMap = new Map<string, ArchitectureEdgePayload[]>();
    const incomingMap = new Map<string, ArchitectureEdgePayload[]>();

    edges.forEach(e => {
      if (!outgoingMap.has(e.source)) outgoingMap.set(e.source, []);
      if (!incomingMap.has(e.target)) incomingMap.set(e.target, []);
      outgoingMap.get(e.source)!.push(e);
      incomingMap.get(e.target)!.push(e);
    });

    // Rule 1: Exposed Database (Frontend connected directly to Database without Gateway or API)
    nodes.forEach(node => {
      if (node.data.tier === 'FRONTEND') {
        const outEdges = outgoingMap.get(node.id) || [];
        outEdges.forEach(edge => {
          const targetNode = nodeMap.get(edge.target);
          if (targetNode && (targetNode.data.tier === 'DATABASE' || targetNode.data.tier === 'CACHE')) {
            issues.push({
              id: `issue-exposed-db-${node.id}-${targetNode.id}`,
              severity: 'error',
              code: 'EXPOSED_DATABASE',
              title: 'Direct Database Exposure',
              message: `Frontend component "${node.data.label}" connects directly to ${targetNode.data.tier.toLowerCase()} "${targetNode.data.label}" without an API Gateway or Backend tier.`,
              nodeIds: [node.id, targetNode.id],
              edgeIds: [edge.id],
              recommendation: 'Introduce a Backend API service or Gateway component between Frontend and Database.',
            });
          }
        });
      }
    });

    // Rule 2: Unconnected / Isolated Component
    nodes.forEach(node => {
      const hasOut = (outgoingMap.get(node.id) || []).length > 0;
      const hasIn = (incomingMap.get(node.id) || []).length > 0;

      if (!hasOut && !hasIn && nodes.length > 1) {
        issues.push({
          id: `issue-isolated-${node.id}`,
          severity: 'warning',
          code: 'ISOLATED_NODE',
          title: 'Unconnected Component',
          message: `Component "${node.data.label}" is isolated and has no connections to the rest of the system.`,
          nodeIds: [node.id],
          edgeIds: [],
          recommendation: 'Connect this component to the architecture flow or remove it if unused.',
        });
      }
    });

    // Rule 3: Single Point of Failure (Database with only 1 incoming connection from non-replicated backend)
    nodes.forEach(node => {
      if (node.data.tier === 'DATABASE') {
        const inEdges = incomingMap.get(node.id) || [];
        if (inEdges.length === 0 && nodes.length > 1) {
          issues.push({
            id: `issue-orphan-db-${node.id}`,
            severity: 'error',
            code: 'ORPHAN_DATABASE',
            title: 'Unreachable Database',
            message: `Database "${node.data.label}" has no incoming backend connections.`,
            nodeIds: [node.id],
            edgeIds: [],
            recommendation: 'Connect a Backend API or Queue consumer to access this database.',
          });
        }
      }
    });

    // Rule 4: Unencrypted API Traffic (HTTP without TLS/SSL marker on public gateway edges)
    edges.forEach(edge => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);

      if (sourceNode?.data.tier === 'FRONTEND' && targetNode?.data.tier === 'GATEWAY') {
        if (edge.data?.protocol && edge.data.protocol.toLowerCase() === 'http') {
          issues.push({
            id: `issue-unencrypted-${edge.id}`,
            severity: 'warning',
            code: 'UNENCRYPTED_TRAFFIC',
            title: 'Insecure Network Traffic',
            message: `Connection from "${sourceNode.data.label}" to "${targetNode.data.label}" uses unencrypted HTTP protocol.`,
            nodeIds: [sourceNode.id, targetNode.id],
            edgeIds: [edge.id],
            recommendation: 'Switch protocol to HTTPS / TLS for all public ingress connections.',
          });
        }
      }
    });

    return issues;
  }

  public static calculateHealthScore(issues: ValidationIssue[]): number {
    let score = 100;
    issues.forEach(issue => {
      if (issue.severity === 'error') score -= 15;
      else if (issue.severity === 'warning') score -= 5;
    });
    return Math.max(0, score);
  }
}
