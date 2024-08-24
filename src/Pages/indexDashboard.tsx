import { useEffect, useState } from "react";
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
import { DashboardData } from "../models/Dashboard";
import { getUriFrontend } from "../utils/getUriFrontend";


export default function Dashboard() {
  const navigate = useNavigate();
  const { authenticated, userInfo } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!authenticated || !userInfo) {
      navigate("/");
    } else {
      fetchDashboardData();
    }
  }, [authenticated, userInfo, navigate]);

  async function fetchDashboardData() {
    try {
      const [ok, uriFrontend] = getUriFrontend(`/api/dashboard/${userInfo?.profile.sub}`);
      if (!ok) {
        return;
      }
      const response = await fetch(uriFrontend, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo?.access_token}`,
        },
      });
      if (!response.ok) {
        // TODO: better redirect
        setDashboardData(null);
        return;
      }

      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (error) {
      setDashboardData(null);
      console.error("Error fetching dashboard data:", error);
    }
  }

  if (!authenticated || !userInfo) {
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
                <TotalWorkflows dashboardData={dashboardData} />
                <SuccessWorkflows dashboardData={dashboardData} />
                <FailedWorkflows dashboardData={dashboardData} />
                <PendingWorkflows dashboardData={dashboardData} />
              </div>
              <RecentWorkflows dashboardData={dashboardData} />
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
