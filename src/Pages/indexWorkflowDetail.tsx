import { useLocation } from 'react-router-dom';
// import { Workflow } from '../models/QuickActions';
import { Workflow } from '../models/Dashboard';

import { NavDashboard } from '../components/Dashboard/NavDashboard';
import { HeaderDashboard } from '../components/Dashboard/HeaderDashboard';
import { DetailWorkflow } from '../components/Workflow/DetailWorkflow';
import { ReactFlowProvider } from '@xyflow/react';

export function WorkflowDetails() {
  const location = useLocation();
  const workflow: Workflow = location.state || {};

  if (!workflow || !workflow.id || workflow.id === "") {
    return <div>No workflow data available.</div>;
  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden" >
        <NavDashboard />
        <div className="flex flex-col" >
          <HeaderDashboard title="Dashboard" />
          {
            (!workflow || !workflow.id || workflow.id === "") ?
              <div>No workflow data available.</div>
              :
              <ReactFlowProvider>
                <DetailWorkflow workflow={workflow} />
              </ReactFlowProvider>
          }
        </div>
      </div>
    </>
  );
}
