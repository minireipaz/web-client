import { Node, Edge, NodeTypes } from '@xyflow/react';
import { WrapperNode } from '../components/Workflow/WrapperNode';
import ButtonEdge from '../components/Workflow/ButtonEdge';

export interface NodeData {
  id: string;
  type: string;
  label: string;
  description: string;
  options: string;
  onClickFromNode: (posX: number, posY: number, nodeID: string) => void;
}

export const nodeTypes: NodeTypes = {
  wrapperNode: WrapperNode,
};

export const edgeTypes = {
  buttonedge: ButtonEdge,
};

export const offsetRight = 80;
export const offsetBottom = -20;

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: string;
  start_time: string;
  duration: number | null;
  sub?: string;
  directory_to_save: string;
  created_at?: string;
  updated_at?: string;
  is_active: 1 | 2 | 3; // Active = 1 // Draft = 2 // Paused = 3

  // ReactFlow specific data
  nodes?: Node[];
  edges?: Edge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface WrapperNodeProps {
  data: NodeData;
}
