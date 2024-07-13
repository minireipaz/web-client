import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider/indexAuthProvider";
import { NavDashboard } from "../components/Dashboard/NavDashboard";
import { HeaderDashboard } from "../components/Dashboard/HeaderDashboard";
import { QuickActions } from "../components/Cards/QuickActions";
import { RecentActivity } from "../components/Cards/RecentActivity";
import { TotalWorkflows } from "../components/Cards/TotalWorkflows";
import { SuccessWorkflows } from "../components/Cards/SuccessWorkflows";
import { FailedWorkflows } from "../components/Cards/FailedWorkflows";
import { PendingWorkflows } from "../components/Cards/PendingWorkflows";
import { RecentWorkflows } from "../components/Cards/RecentWorkflows";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  if (!userInfo) {
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden" >
        <NavDashboard />
        <div className="flex flex-col" >
          <HeaderDashboard title="Dashboard" />
          <div className="flex-1 grid grid-cols-[240px_1fr] gap-6 p-6" >
            <div className="flex flex-col gap-6" >
              <QuickActions />
              <RecentActivity />
            </div>
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
      </div>

    </>
  );
}
