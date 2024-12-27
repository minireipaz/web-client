import { useMemo } from 'react';
import { DashboardData } from '../../models/Dashboard';
import { Spinner } from 'flowbite-react';

interface ContainerProps {
  dashboardData: DashboardData | null;
}

export function FailedWorkflows(props: ContainerProps) {
  const failedWorkflows = useMemo(() => {
    if (!props.dashboardData?.workflow_counts?.length) {
      return 0;
    }
    return props.dashboardData?.workflow_counts[0].failed_workflows as number;
  }, [props.dashboardData]);

  const displayFailedWorkflows = useMemo(() => {
    return Number.isInteger(failedWorkflows) ? failedWorkflows : '--';
  }, [failedWorkflows]);

  return (
    <>
      <div className="rounded-lg border ">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="whitespace-pre-wrap text-2xl font-semibold leading-none tracking-tight">
            Failed Workflows
          </h3>
          <p className="text-sm ">Workflows that failed to complete</p>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div className="text-4xl font-bold">
            {props.dashboardData ? displayFailedWorkflows : <Spinner />}
          </div>
        </div>
      </div>
    </>
  );
}
