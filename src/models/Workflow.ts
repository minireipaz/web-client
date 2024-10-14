import { Node, Edge, NodeTypes } from '@xyflow/react';
import { WrapperNode } from '../components/Workflow/WrapperNode';
import ButtonEdge from '../components/Workflow/ButtonEdge';
import { CustomFlowbiteTheme } from 'flowbite-react';

export interface NodeData {
  id: string;
  type: string;
  label: string;
  description: string;
  options: string;
  onClickFromNode?: (posX: number, posY: number, nodeID: string) => void;
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
  status: number; // Initial = 1 Pending = 2 Completed = 3 Processing = 4 Failed = 5
  start_time?: string;
  duration?: number | null;
  user_id?: string;
  directory_to_save: string;
  created_at?: string;
  updated_at?: string;
  access_token?: string;
  is_active: 1 | 2 | 3; // Active = 1 // Draft = 2 // Paused = 3
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

export interface ResponseSyncWorkflow {
  error: string;
  status: number;
  data: {}
}

export interface ResponseUpdateWorkflow {
  error: string;
  status: number;
}

export interface ResponseGetWorkflow {
  error: string;
  status: number;
  workflow: Workflow;
}

export interface ResponseGetAllWorkflows {
  error: string;
  status: number;
  workflow: Workflow[];
}


export interface MsgSaved {
  text: string;
  classText?: string;
}

export const savedStatus: Record<string, string> = {
  "warn": 'text-sm bg-orange-100 text-yellow-800 select-none',
  "notice": 'text-sm text-gray-400 select-none',
  "done": 'text-sm text-green-800 select-none',
  "alert": 'text-sm bg-red-100 text-red-800 select-none',
  "none": "",
};

export const customTooltipTheme: CustomFlowbiteTheme["tooltip"] = {
  target: "w-[-webkit-fill-available]"
};
