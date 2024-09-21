import { useLocation } from 'react-router-dom';
import { NavDashboard } from '../components/Dashboard/NavDashboard';
import { DetailWorkflow } from '../components/Workflow/DetailWorkflow';
import { ReactFlowProvider } from '@xyflow/react';
import HeaderWorkflow from '../components/Workflow/HeaderWorkflow';
import { ResponseGenerateWorkflow } from '../models/QuickActions';

export function WorkflowDetails() {
  const location = useLocation();
  const currentState = location.state || {};
  const { workflow }: ResponseGenerateWorkflow = currentState.workflow;

  if (!workflow || !workflow?.id || workflow?.id === "") {
    return <div>No workflow data available.</div>;
  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden" >
        <NavDashboard />
        <div className="flex flex-col" >
          <HeaderWorkflow workflow={workflow} />
          {
            (!workflow || !workflow.id || workflow.id === "") ?
              <div>No workflow data available.</div>
              :
              <>
                <ReactFlowProvider>
                  <DetailWorkflow workflow={workflow} />
                </ReactFlowProvider>
              </>
          }
        </div>
      </div>
    </>
  );
}
