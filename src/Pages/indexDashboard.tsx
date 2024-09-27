import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider/indexAuthProvider";
import { NavDashboard } from "../components/Dashboard/NavDashboard";
import { HeaderDashboard } from "../components/Dashboard/HeaderDashboard";
import { DashboardData, ResponseDashboardData, WorkflowCounts } from "../models/Dashboard";
import { getUriFrontend } from "../utils/getUriFrontend";
import { ContentDashboard } from "../components/Dashboard/ContentDashboard";
import { Workflow } from "../models/Workflow";

export default function Dashboard() {
  const { authenticated, userInfo } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!authenticated || !userInfo) {
      return;
    }

    try {
      const [ok, uriFrontend] = getUriFrontend(`/api/dashboard/${userInfo?.profile.sub}`);
      if (!ok) {
        console.log("ERROR | cannot get uri frontend");
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

      const data: ResponseDashboardData = await response.json();
      if (data.error !== "" || data.status !== 200) {
        console.log("ERROR | cannot get dashboard data"); // loop
        return;
      }
      let convertedDashboard: DashboardData = convertDashboardData(data);
      setDashboardData(convertedDashboard);
    } catch (error) {
      setDashboardData(null);
      console.error("Error fetching dashboard data:", error);
    }
  }, [authenticated, userInfo]);

  useEffect(() => {
    if (authenticated && userInfo) {
      if (!dashboardData) {
        fetchDashboardData();
      }
    }
  }, [authenticated, userInfo]);

  useEffect(() => {
    const handlePopState = () => {
      if (!dashboardData) {
        fetchDashboardData();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [fetchDashboardData]);

  function convertDashboardData(responseData: ResponseDashboardData): DashboardData {
    let dashboard: DashboardData = {
      workflow_counts: [],
      workflows_recents: [],
    }

    for (let i = 0; i < responseData.data.length; i++) {
      const stats: WorkflowCounts = {
        total_workflows: responseData.data[i].total_workflows,
        successful_workflows: responseData.data[i].successful_workflows,
        failed_workflows: responseData.data[i].failed_workflows,
        pending_workflows: responseData.data[i].pending_workflows,
      };
      dashboard.workflow_counts.push(stats);
      for (let j = 0; j < responseData.data[i].recent_workflows!.length; j++) {
        const values = responseData?.data[i]?.recent_workflows![j];
        if (!values) continue;

        let workflows: Workflow = {
          id: values[0],
          name: values[1],
          description: values[2],
          status: values[3],
          is_active: Number.parseInt(values[4]) as 1 | 2 | 3,
          start_time: values[5],
          duration: Number.parseInt(values[6]) || 0,
          directory_to_save: "home",
          nodes: [],
          edges: [],
        };
        dashboard.workflows_recents.push(workflows);
      }


    }
    return dashboard;
  }

  if (!authenticated || !userInfo) {
    return <div>Redirecting dasboard...</div>;
  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden" >
        <NavDashboard />
        <div className="flex flex-col" >
          <HeaderDashboard title="Dashboard" />
          <ContentDashboard dashboardData={dashboardData} />
        </div>
      </div>
    </>
  );
}
