import { Link } from 'react-router-dom';
import { DashboardData, statusMap, activeMap } from "../../models/Dashboard";


interface ContainerProps {
  dashboardData: DashboardData | null
}

export function RecentWorkflows(props: ContainerProps) {

  function formatDuration(durationStr: string | null): string {
    const duration = Number.parseInt(durationStr as string);
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

  function formatStartTime(startTime: string): string {
    if (startTime === "1970-01-01 00:00:00") {
      return "Not Started";
    }
    return new Date(startTime).toLocaleString();
  }

  function formatTextIsActive(isActive: string) {
    let activeText = activeMap[Number.parseInt(isActive)].text;
    if (!activeText) {
      activeText = "N/A";
    }
    return activeText;
  }

  function formatClassIsActive(isActive: string) {
    let activeClass = activeMap[Number.parseInt(isActive)].class;
    if (!activeClass) {
      activeClass = activeMap[3].class;
    }
    return activeClass;
  }

  const recentWorkflows = props.dashboardData?.workflows_recents;

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Recent Workflows</h3>
          <p className="text-sm">View the latest workflows</p>
        </div>
        <div className="pt-0 pr-4 pl-4 pb-4">
          <div className="relative w-full overflow-auto">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 font-medium text-sm border-b py-2">
              <div className="px-4">Active</div>
              <div className="px-4">Name</div>
              <div className="px-4">Status</div>
              <div className="px-4">Started</div>
              <div className="px-4">Duration</div>
              <div className="px-4">Actions</div>
            </div>

            {/* List of workflows */}
            <ul className="text-sm list-none m-0 p-0">
              {recentWorkflows && recentWorkflows.length > 0 ? (
                recentWorkflows.map((workflow, index) => (
                  <li key={index} className="border-b last:border-b-0">
                    <Link
                      to={`/workflow/${workflow.id}`}
                      state={workflow}
                      className="block hover:bg-blue-800 transition-colors"
                    >
                      <div className="grid grid-cols-6 gap-4 py-4">
                        <div className="px-4">
                          <div className={`text-sm ${formatClassIsActive(workflow.is_active)}`} >{formatTextIsActive(workflow.is_active)}</div>
                        </div>
                        <div className="px-4">
                          <div className="font-medium">{workflow.workflow_name}</div>
                          <div className="text-sm">{workflow.workflow_description}</div>
                        </div>
                        <div className="px-4 flex items-center">
                          <div className={`${statusMap[Number.parseInt(workflow.status)].class} inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground`}>
                            {statusMap[Number.parseInt(workflow.status)].text}
                          </div>
                        </div>
                        <div className="px-4 flex items-center">{formatStartTime(workflow.start_time)}</div>
                        <div className="px-4 flex items-center">{formatDuration(workflow.duration)}</div>
                        <div className="px-4 flex items-center">
                          <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                            type="button"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <polyline points="18 8 22 12 18 16"></polyline>
                              <polyline points="6 8 2 12 6 16"></polyline>
                              <line x1="2" x2="22" y1="12" y2="12"></line>
                            </svg>
                            <span className="sr-only">Actions</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="py-4 px-4">
                  <div className="font-medium">No data</div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
