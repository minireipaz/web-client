import { useLocation } from 'react-router-dom';
import { Workflow } from '../models/QuickActions';


export function WorkflowDetails() {
  const location = useLocation();
  const workflow: Workflow = location.state || {};

  if (!workflow || workflow.id) {
    return <div>No workflow data available.</div>;
  }

  return(
    <>
    </>
  );
}
