import dagre from "dagre";
import { Node, Edge, XYPosition } from "@xyflow/react";

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
   * Calculate position for a new node based on existing layout
   */
  static calculateNewNodePosition(
    nodes: Node[],
    nodeType: string,
    nodeIndex: number = 0
  ): XYPosition {
    if (nodes.length === 0) {
      // First node - place in center
      return { x: 100, y: 100 };
    }

    // Get bounds of existing nodes
    const bounds = this.getNodesBounds(nodes);

    // Calculate position based on node type and existing layout
    switch (nodeType) {
      case "initial":
        // Place initial node to the left of existing nodes
        return {
          x: Math.max(50, bounds.minX - this.NODE_WIDTH - 50),
          y: bounds.minY,
        };

      case "resizableGroup":
        // Place rule groups to the right of existing nodes
        return {
          x: bounds.maxX + 50 + nodeIndex * (this.NODE_WIDTH + 50),
          y: bounds.minY + nodeIndex * (this.NODE_HEIGHT + 50),
        };

      default:
        // Default positioning
        return {
          x: bounds.maxX + 50,
          y: bounds.minY + nodeIndex * (this.NODE_HEIGHT + 50),
        };
    }
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
