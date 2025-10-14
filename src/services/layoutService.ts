import dagre from "@dagrejs/dagre";
import { Node, Edge, XYPosition, ReactFlowInstance } from "@xyflow/react";

export interface LayoutedElements {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Layout service using Dagre as recommended by React Flow documentation
 * Reference: https://reactflow.dev/learn/layouting/layouting
 */
export class LayoutService {
  private static readonly NODE_WIDTH = 300;
  private static readonly NODE_HEIGHT = 200;

  /**
   * Get layouted elements using Dagre algorithm
   * Based on React Flow's recommended approach
   */
  static getLayoutedElements(
    nodes: Node[],
    edges: Edge[],
    direction: "TB" | "LR" = "LR"
  ): LayoutedElements {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
      rankdir: direction,
      nodesep: 50, // Horizontal spacing between nodes
      ranksep: 100, // Vertical spacing between ranks
      marginx: 20,
      marginy: 20,
    });

    // Add nodes to dagre graph
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, {
        width: this.NODE_WIDTH,
        height: this.NODE_HEIGHT,
      });
    });

    // Add edges to dagre graph
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    // Run dagre layout
    dagre.layout(dagreGraph);

    // Update node positions based on dagre layout
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - this.NODE_WIDTH / 2,
          y: nodeWithPosition.y - this.NODE_HEIGHT / 2,
        },
      };
    });

    return {
      nodes: layoutedNodes,
      edges,
    };
  }

  /**
   * Calculate position using React Flow native methods and Dagre
   */
  static calculateOffsetPosition(
    nodes: Node[],
    nodeType: string,
    reactFlowInstance?: ReactFlowInstance,
    parentId?: string
  ): XYPosition {
    // Filter nodes based on context (main flow vs within group)
    let relevantNodes = nodes;
    if (parentId) {
      // For child nodes within a group, only consider nodes in the same group
      relevantNodes = nodes.filter((node) => node.parentId === parentId);
    } else {
      // For main flow nodes, exclude child nodes
      relevantNodes = nodes.filter((node) => !node.parentId);
    }

    // Filter by node type if specified
    if (nodeType) {
      relevantNodes = relevantNodes.filter((node) => node.type === nodeType);
    }

    if (relevantNodes.length === 0) {
      // No existing nodes of this type - use React Flow native method for default position
      if (reactFlowInstance && !parentId) {
        const viewport = reactFlowInstance.getViewport();
        return {
          x: viewport.x + 100,
          y: viewport.y + 100,
        };
      }
      return parentId ? { x: 10, y: 10 } : { x: 100, y: 100 };
    }

    // Use React Flow native method to get bounds of relevant nodes
    if (reactFlowInstance && !parentId) {
      // Use viewport for positioning instead of getBounds (which doesn't exist)
      const viewport = reactFlowInstance.getViewport();
      const lastNode = relevantNodes[relevantNodes.length - 1];
      return {
        x: lastNode.position.x + 10,
        y: lastNode.position.y + 10,
      };
    }

    // Fallback to simple calculation for child nodes
    const lastNode = relevantNodes[relevantNodes.length - 1];
    return {
      x: lastNode.position.x + 10,
      y: lastNode.position.y + 10,
    };
  }

  /**
   * Calculate position for a new node using simple 10px offset (working approach)
   */
  static calculateNewNodePosition(
    nodes: Node[],
    nodeType: string,
    reactFlowInstance?: ReactFlowInstance,
    nodeIndex: number = 0
  ): XYPosition {
    if (nodes.length === 0) {
      // First node - use React Flow native method for center position
      if (reactFlowInstance) {
        const viewport = reactFlowInstance.getViewport();
        return { x: viewport.x + 100, y: viewport.y + 100 };
      }
      return { x: 100, y: 100 };
    }

    // Use simple 10px offset approach (this was working perfectly)
    return this.calculateOffsetPosition(nodes, nodeType, reactFlowInstance);
  }

  /**
   * Get bounds of all nodes
   */
  private static getNodesBounds(nodes: Node[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    if (nodes.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    const xPositions = nodes.map((node) => node.position.x);
    const yPositions = nodes.map((node) => node.position.y);

    return {
      minX: Math.min(...xPositions),
      minY: Math.min(...yPositions),
      maxX: Math.max(
        ...xPositions.map((x, i) => x + (nodes[i].width || this.NODE_WIDTH))
      ),
      maxY: Math.max(
        ...yPositions.map((y, i) => y + (nodes[i].height || this.NODE_HEIGHT))
      ),
    };
  }

  /**
   * Auto-layout all nodes using Dagre
   */
  static autoLayout(nodes: Node[], edges: Edge[]): LayoutedElements {
    return this.getLayoutedElements(nodes, edges, "LR");
  }
}
