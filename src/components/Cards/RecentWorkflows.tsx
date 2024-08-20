import { DashboardData, statusMap } from "../../models/Dashboard";

interface ContainerProps {
  dashboardData: DashboardData | null
}

export function RecentWorkflows(props: ContainerProps) {

  function formatDuration(duration: number | null): string {
    if (duration === null || duration === undefined || !Number.isInteger(duration)) {
      return "N/A";
    }

    if (duration >= 60) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    }

    return `${duration}s`;
  }

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
        <div className="flex flex-col space-y-1.5 p-6" >
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight" >Recent Workflows</h3>
          <p className="text-sm text-muted-foreground" >View the latest workflows</p>
        </div>
        <div className="p-6" >
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm" >
              <thead className="" >
                <tr className="border-b transition-colors hover:bg-muted/50 " >
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Started</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Duration</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground " >Actions</th>
                </tr>
              </thead>
              <tbody className="" >
                {props.dashboardData?.recentWorkflows.map((workflow, index) => (
                  <tr key={index} className="border-b transition-colors hover:bg-muted/50 " >
                    <td className="p-4 align-middle ">
                      <div className="font-medium" >{workflow.workflow_name}</div>
                      <div className="text-sm text-muted-foreground" >{workflow.workflow_description}</div>
                    </td>
                    <td className="p-4 align-middle " >
                      <div className={`${statusMap[workflow.execution_status].class} inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground`} >
                        {statusMap[workflow.execution_status].text}
                      </div>
                    </td>
                    <td className="p-4 align-middle ">{new Date(workflow.start_time).toLocaleString()}</td>
                    <td className="p-4 align-middle ">{formatDuration(workflow.duration)}</td>
                    <td className="p-4 align-middle ">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10" type="button" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="18 8 22 12 18 16"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" x2="22" y1="12" y2="12"></line></svg>
                        <span className="sr-only" >Actions</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
