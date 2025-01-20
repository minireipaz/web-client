import { useMemo } from "react";
import { DashboardData } from "../../models/Dashboard";
import { Spinner } from "flowbite-react";

interface ContainerProps {
  dashboardData: DashboardData | null;
}

export function TotalWorkflows(props: ContainerProps) {
  const totalWorkflows = useMemo(() => {
    if (!props.dashboardData?.workflow_counts?.length) {
      return 0;
    }
    return props.dashboardData?.workflow_counts[0].total_workflows as number;
  }, [props.dashboardData]);

  const displayTotalWorkflows = useMemo(() => {
    return Number.isInteger(totalWorkflows) ? totalWorkflows : "--";
  }, [totalWorkflows]);

  return (
    <>
      <div className="rounded-lg border ">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="whitespace-pre-wrap text-2xl font-semibold leading-none tracking-tight">
            Total Workflows
          </h3>
          <p className="text-sm">All workflows created</p>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div className="text-4xl font-bold">
            {props.dashboardData ? displayTotalWorkflows : <Spinner />}
          </div>
        </div>
      </div>
    </>
  );
}
