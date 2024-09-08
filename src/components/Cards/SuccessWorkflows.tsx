import { useMemo } from "react";
import { DashboardData } from "../../models/Dashboard";

interface ContainerProps {
  dashboardData: DashboardData | null
}

export function SuccessWorkflows(props: ContainerProps) {
  const successWorkflows = useMemo(() => {
    if (!props.dashboardData?.workflow_counts?.length) {
      return 0;
    }
    return props.dashboardData?.workflow_counts[0].successful_workflows as number;
  }, [props.dashboardData]);

  const displaySuccessWorkflows = useMemo(() => {
    return Number.isInteger(successWorkflows) ? successWorkflows : "--";
  }, [successWorkflows]);
  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
        <div className="flex flex-col space-y-1.5 p-6" >
          <h3 className="whitespace-pre-wrap text-2xl font-semibold leading-none tracking-tight" >Successful Workflows</h3>
          <p className="text-sm" >Workflows that completed successfully</p>
        </div>
        <div className="p-6 flex items-center justify-between" >
          <div className="text-4xl font-bold" >{displaySuccessWorkflows}</div>
        </div>
      </div>
    </>
  );
}
