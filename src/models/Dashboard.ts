
export interface Workflow {
  workflow_id: string;
  workflow_name: string;
  workflow_description: string;
  workflow_status: string;
  execution_status: 1 | 2 | 3 | 4; // 1: pending, 2: processing, 3: completed, 4: failed;
  start_time: string;
  duration: number | null;
}

export interface WorkflowCounts {
  total_workflows: number;
  successful_workflows: number;
  failed_workflows: number;
  pending_workflows: number;
}

export interface DashboardData {
  user_workflows: Workflow[];
  workflow_counts: WorkflowCounts;
  recent_workflows: Workflow[];
  error: string;
}

export const statusMap = {
  1: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
  2: { text: 'Processing', class: 'bg-blue-100 text-blue-800' },
  3: { text: 'Completed', class: 'bg-green-100 text-green-800' },
  4: { text: 'Failed', class: 'bg-red-100 text-red-800' },
};
