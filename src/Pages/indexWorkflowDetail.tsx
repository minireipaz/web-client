import { useLocation } from 'react-router-dom';
import { NavDashboard } from '../components/Dashboard/NavDashboard';
import { DetailWorkflow } from '../components/Workflow/DetailWorkflow';
import { ReactFlowProvider } from '@xyflow/react';
import { Workflow } from '../models/Workflow';

export function WorkflowDetails() {
  const location = useLocation();
  const currentState = location.state || {};
  let workflow: Workflow | undefined = undefined;
  if (!currentState.workflow) {
    workflow = currentState;
  } else {
    workflow = currentState.workflow.workflow;
  }

  if (!workflow || !workflow?.id || workflow?.id === "") {
    return <div>No workflow data available.</div>;
  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden">
        <NavDashboard />
        <ReactFlowProvider>
          <DetailWorkflow workflow={workflow} />
        </ReactFlowProvider>
      </div>
    </>
  );
}
