import { useMemo } from "react";
import { DashboardData } from "../../models/Dashboard";

interface ContainerProps {
  dashboardData: DashboardData | null
}

export function TotalWorkflows(props: ContainerProps) {
  const totalWorkflows = props.dashboardData?.workflow_counts.total_workflows;

  const displayTotalWorkflows = useMemo(() => {
    return Number.isInteger(totalWorkflows) ? totalWorkflows : "--";
  }, [totalWorkflows]);

  return(
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
        <div className="flex flex-col space-y-1.5 p-6" >
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight" >Total Workflows</h3>
          <p className="text-sm" >All workflows created</p>
        </div>
        <div className="p-6 flex items-center justify-between" >
          <div className="text-4xl font-bold" >{displayTotalWorkflows}</div>
        </div>
      </div>
    </>
  );
}
