import { Link } from 'react-router-dom';
import { DashboardData, statusMap, activeMap } from "../../models/Dashboard";
import {  Dropdown, Tooltip } from 'flowbite-react';
import { customTooltipTheme } from '../../models/Workflow';


interface ContainerProps {
  dashboardData: DashboardData | null
}



export function RecentWorkflows(props: ContainerProps) {

  function formatDuration(durati: number): string {
    if (!durati) return "N/A";

    const duration = Number.parseInt(durati.toString() as string);
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
    if (!startTime) return "Not Started";

    if (startTime.startsWith("1970") || startTime.startsWith("0001")) {
      return "Not Started";
    }
    return new Date(startTime).toLocaleString();
  }

  function formatTextIsActive(isActive: Number) {
    const index: string = isActive.toString();
    let activeText = activeMap[Number.parseInt(index)].text;
    if (!activeText) {
      activeText = activeMap[3].text;
    }
    return activeText;
  }

  function formatDescription(desp: string) {
    if (!desp || desp === null) {
      return "--";
    }
    return desp;
  }

  const recentWorkflows = props.dashboardData?.workflows_recents;

  return (
    <>
      <div className="rounded-lg border ">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Recent Workflows</h3>
          <p className="text-sm">View the latest workflows</p>
        </div>
        <div className="pt-0 pr-4 pl-4 pb-4">
          <div className="relative w-full">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 font-medium text-sm border-b py-2">
              <div className="px-4">Name</div>
              <div className="px-4">Description</div>
              <div className="px-4">Status</div>
              <div className="px-4">Started</div>
              <div className="px-4">Duration</div>
              <div className="px-4">Actions</div>
            </div>

            {/* List of workflows */}
            <ul className="text-sm list-none m-0 p-0">
              {recentWorkflows && recentWorkflows.length > 0 ? (
                recentWorkflows.map( (workflow, index) => (
                  <li key={index} className="border-b last:border-b-0">
                    <div className="grid grid-cols-6 gap-4 py-2 items-center">
                      <div className="px-4">
                        <Link
                          to={`/workflow/${workflow.id}`}
                          className="w-fit font-medium flex flex-shrink-0 cursor-pointer items-center underline underline-offset-4 "
                        >
                          <span>
                            <svg width="8" height="8" viewBox="0 0 50 50" fill="none" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="25" cy="25" r="25" fill={formatTextIsActive(workflow.is_active)}></circle>
                            </svg>
                          </span>
                          <span title={workflow.name} className='overflow-ellipsis overflow-hidden whitespace-nowrap ml-2  '>
                            {workflow.name}
                          </span>
                        </Link>
                      </div>
                      <div className="px-4 flex items-center">
                        <Tooltip theme={customTooltipTheme} placement="top" content={formatDescription(workflow.description)}>
                          <div className="text-sm overflow-ellipsis overflow-hidden whitespace-nowrap">{formatDescription(workflow.description)}</div>
                        </Tooltip>
                      </div>
                      <div className="px-4 flex items-center">
                        <div className={`${statusMap[Number.parseInt(workflow.status.toString())].class} inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground`}>
                          {statusMap[Number.parseInt(workflow.status.toString())].text}
                        </div>
                      </div>
                      <div className="px-4 flex items-center">{formatStartTime(workflow.start_time as string)}</div>
                      <div className="px-4 flex items-center">{formatDuration(workflow.duration as number)}</div>
                      <div className="px-4 flex items-center">
                        <Dropdown label="More" dismissOnClick={false}>
                          <Dropdown.Item>Option 1</Dropdown.Item>
                          <Dropdown.Item>Option 2</Dropdown.Item>
                          <Dropdown.Item>Option 3</Dropdown.Item>
                          <Dropdown.Item>Option 4</Dropdown.Item>
                        </Dropdown>
                      </div>
                    </div>
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
      </div >
    </>
  );
}
