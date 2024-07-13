import { FailedWorkflows } from "../components/Cards/FailedWorkflows";
import { PendingWorkflows } from "../components/Cards/PendingWorkflows";
import { RecentWorkflows } from "../components/Cards/RecentWorkflows";
import { SuccessWorkflows } from "../components/Cards/SuccessWorkflows";
import { TotalWorkflows } from "../components/Cards/TotalWorkflows";
import { HeaderDashboard } from "../components/Dashboard/HeaderDashboard";
import { NavDashboard } from "../components/Dashboard/NavDashboard";

export function Workflows() {
  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden" >
        <NavDashboard />
        <div className="flex flex-col" >
          <HeaderDashboard title="Workflows" />
          <div className="grid gap-6" >
            <div className="grid grid-cols-2 gap-6" >
              <TotalWorkflows />
              <SuccessWorkflows />
              <FailedWorkflows />
              <PendingWorkflows />
            </div>
            <RecentWorkflows />
          </div>
        </div>
      </div>
    </>
  );
}
