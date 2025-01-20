import React from "react";
import { DashboardData } from "../../models/Dashboard";
import { FailedWorkflows } from "../Cards/FailedWorkflows";
import { PendingWorkflows } from "../Cards/PendingWorkflows";
import { QuickActions } from "../Cards/QuickActions";
import { RecentActivity } from "../Cards/RecentActivity";
import { RecentWorkflows } from "../Cards/RecentWorkflows";
import { SuccessWorkflows } from "../Cards/SuccessWorkflows";
import { TotalWorkflows } from "../Cards/TotalWorkflows";

interface ContainerProps {
  dashboardData: DashboardData | null;
}
export const ContentDashboard = React.memo(function ContentDashboard(
  props: ContainerProps,
) {
  return (
    <>
      <div className="flex-1 grid grid-cols-[240px_1fr] gap-6 p-6">
        <div className="flex flex-col gap-6">
          <QuickActions />
          <RecentActivity />
        </div>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <TotalWorkflows dashboardData={props.dashboardData} />
            <SuccessWorkflows dashboardData={props.dashboardData} />
            <FailedWorkflows dashboardData={props.dashboardData} />
            <PendingWorkflows dashboardData={props.dashboardData} />
          </div>
          <RecentWorkflows dashboardData={props.dashboardData} />
        </div>
      </div>
    </>
  );
});
