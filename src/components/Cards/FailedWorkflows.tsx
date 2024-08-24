import { useMemo } from "react";
import { DashboardData } from "../../models/Dashboard";

interface ContainerProps {
  dashboardData: DashboardData | null
}

export function FailedWorkflows(props: ContainerProps) {
  const failedWorkflows = props.dashboardData?.workflow_counts.pending_workflows;

  const displayFailedWorkflows = useMemo(() => {
    return Number.isInteger(failedWorkflows) ? failedWorkflows : "--";
  }, [failedWorkflows]);

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
        <div className="flex flex-col space-y-1.5 p-6" >
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight" >Failed Workflows</h3>
          <p className="text-sm " >Workflows that failed to complete</p>
        </div>
        <div className="p-6 flex items-center justify-between" >
          <div className="text-4xl font-bold" >{displayFailedWorkflows}</div>
        </div>
      </div>
    </>
  );
}
