import { Workflow } from "./Workflow";



export interface ResponseDashboardData {
  status: number;
  error: string;
  data: WorkflowCounts[];

}

export interface WorkflowCounts {
  total_workflows: number;
  successful_workflows: number;
  failed_workflows: number;
  pending_workflows: number;
  recent_workflows?: string[][];
}

export interface DashboardData {
  workflow_counts: WorkflowCounts[];
  workflows_recents: Workflow[];
}

export const statusMap: Record<number, Record<string, string>> = {
  0: { text: 'Initial', class: 'bg-orange-100 text-yellow-800' },
  1: { text: 'Initial', class: 'bg-orange-100 text-yellow-800' },
  2: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
  3: { text: 'Completed', class: 'bg-green-100 text-green-800' },
  4: { text: 'Processing', class: 'bg-blue-100 text-blue-800' },
  5: { text: 'Failed', class: 'bg-red-100 text-red-800' },
};

export const activeMap: Record<number, Record<string, string>> = {
  1: { text: '#27F795' },
  2: { text: '#eff727' },
  3: { text: '#f7272f' },
}
