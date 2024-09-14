
export interface Workflow {
  workflow_id: string;
  workflow_name: string;
  workflow_description: string;
  workflow_status: string;
  execution_status: 1 | 2 | 3 | 4; // 1: pending, 2: processing, 3: completed, 4: failed;
  start_time: string;
  duration: number | null;
}

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

export interface RecenWorkflows {
  id: string;
  workflow_name: string;
  workflow_description: string;
  status: string;
  is_active: string;
  start_time: string;
  duration: string;
}

export interface DashboardData {
  workflow_counts: WorkflowCounts[];
  workflows_recents: RecenWorkflows[];
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
  1: { text: 'Active', class: 'text-[#03ffbe]' },
  2: { text: 'Draft', class: 'text-gray-800' },
  3: { text: 'Paused', class: 'text-red-800' },
}
