import { useMemo } from "react";

export interface Workflow {
  workflow_id: string;
  workflow_name: string;
  workflow_description: string;
  workflow_status: string;
  execution_status: number;
  start_time: string;
  duration: number | null;
}

export interface WorkflowCounts {
  total_workflows: number;
  successful_workflows: number;
  failed_workflows: number;
  pending_workflows: number;
}

export interface RecentWorkflow {
  workflow_name: string;
  workflow_description: string;
  execution_status: 1 | 2 | 3 | 4; // 1: pending, 2: processing, 3: completed, 4: failed;
  start_time: string;
  duration: number | null;
}

export interface DashboardData {
  userWorkflows: Workflow[];
  workflowCounts: WorkflowCounts;
  recentWorkflows: RecentWorkflow[];
}

export const statusMap = {
  1: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
  2: { text: 'Processing', class: 'bg-blue-100 text-blue-800' },
  3: { text: 'Completed', class: 'bg-green-100 text-green-800' },
  4: { text: 'Failed', class: 'bg-red-100 text-red-800' },
};

const simulatedWorkflows: Workflow[] = [
  {
    workflow_id: "w1",
    workflow_name: "Deploy to Production",
    workflow_description: "Deploying the latest version to production.",
    workflow_status: "Completed",
    execution_status: 3, // Completado
    start_time: "2023-04-15 10:30:00",
    duration: 900, // 15 minutos
  },
  {
    workflow_id: "w2",
    workflow_name: "Update Dependencies",
    workflow_description: "Updating project dependencies to the latest version.",
    workflow_status: "Processing",
    execution_status: 2, // En proceso
    start_time: "2023-04-12 15:45:00",
    duration: null, // Aún en ejecución
  },
  {
    workflow_id: "w3",
    workflow_name: "Run E2E Tests",
    workflow_description: "Executing end-to-end tests.",
    workflow_status: "Failed",
    execution_status: 4, // Fallido
    start_time: "2023-04-10 09:00:00",
    duration: 2700, // 45 minutos
  },
  {
    workflow_id: "w4",
    workflow_name: "Build and Deploy",
    workflow_description: "Building and deploying the application.",
    workflow_status: "Pending",
    execution_status: 1, // Pendiente
    start_time: "2023-04-08 14:15:00",
    duration: null, // Aún no iniciado
  },
  {
    workflow_id: "w5",
    workflow_name: "Code Review",
    workflow_description: "Reviewing code for quality assurance.",
    workflow_status: "Completed",
    execution_status: 3, // Completado
    start_time: "2023-04-16 11:00:00",
    duration: 600, // 10 minutos
  }
];

// Simulación de los contadores obtenidos del nodo `workflow_counts`
const workflowCounts: WorkflowCounts = {
  total_workflows: simulatedWorkflows.length,
  successful_workflows: simulatedWorkflows.filter(w => w.execution_status === 3).length, // Completados
  failed_workflows: simulatedWorkflows.filter(w => w.execution_status === 4).length, // Fallidos
  pending_workflows: simulatedWorkflows.filter(w => w.execution_status === 1 || w.execution_status === 2).length, // Pendientes y en proceso
};

// Simulación de los workflows recientes obtenidos del nodo `recent_workflows`
const recentWorkflows: RecentWorkflow[] = simulatedWorkflows
  .filter(w => w.execution_status !== 1) // Filtrar los que tienen estado de ejecución
  .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()) // Ordenar por `start_time` descendente
  .slice(0, 5) // Limitar a los 5 más recientes
  .map(workflow => ({
    workflow_name: workflow.workflow_name,
    workflow_description: workflow.workflow_description,
    execution_status: workflow.execution_status as 1 | 2 | 3 | 4, // Ajuste de tipo
    start_time: workflow.start_time,
    duration: workflow.duration,
  }));


export const simulatedDashboardData: DashboardData = {
  userWorkflows: simulatedWorkflows,
  recentWorkflows: recentWorkflows,
  workflowCounts: workflowCounts,
}
