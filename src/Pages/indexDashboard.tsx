import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider/indexAuthProvider";
import { NavDashboard } from "../components/Dashboard/NavDashboard";
import { HeaderDashboard } from "../components/Header/Headers";
import {
  DashboardData,
  ResponseDashboardData,
  WorkflowCounts,
} from "../models/Dashboard";
import { getUriFrontend } from "../utils/getUriFrontend";
import { ContentDashboard } from "../components/Dashboard/ContentDashboard";
import { Workflow } from "../models/Workflow";
import { Node, Edge } from "@xyflow/react";

export default function Dashboard() {
  const { authenticated, handleTokenExpiration, userInfo } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const navigate = useNavigate();
  const fetchedRef = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    try {
      const [ok, uriFrontend] = getUriFrontend(
        `/api/v1/dashboard/${userInfo?.profile.sub}`,
      );
      if (!ok) {
        console.log("ERROR | cannot get uri frontend");
        return;
      }
      const response = await fetch(uriFrontend, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
      });

      if (response.status === 401) {
        // Token has expired, handle expiration and redirect
        handleTokenExpiration();
        // navigate("/", { replace: true });
        return;
      }

      if (!response.ok) {
        setDashboardData(null);
        return;
      }

      const data: ResponseDashboardData = await response.json();
      if (data.error !== "" || data.status !== 200) {
        console.log("ERROR | cannot get dashboard data");
        return;
      }
      let convertedDashboard: DashboardData = convertDashboardData(data);
      setDashboardData(convertedDashboard);
    } catch (error) {
      setDashboardData(null);
      console.error("Error fetching dashboard data:", error);
    }
  }, [handleTokenExpiration, navigate]);

  useEffect(() => {
    if (!authenticated) {
      navigate("/", { replace: true });
      return;
    }

    if (userInfo) {
      if (!dashboardData) {
        fetchDashboardData();
      }
    }
  }, [userInfo, authenticated, fetchDashboardData, navigate]);

  useEffect(() => {
    const handlePopState = () => {
      if (!dashboardData) {
        fetchDashboardData();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [fetchDashboardData, dashboardData]);

  function convertDashboardData(
    responseData: ResponseDashboardData,
  ): DashboardData {
    let dashboard: DashboardData = {
      workflow_counts: [],
      workflows_recents: [],
    };

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
          status: Number.parseInt(values[3]),
          is_active: Number.parseInt(values[4]) as 1 | 2 | 3,
          created_at: values[5] as string,
          updated_at: values[6] as string,
          nodes: JSON.parse(values[7]) as Node[],
          edges: JSON.parse(values[8]) as Edge[],
          viewport: JSON.parse(values[9]),
          directory_to_save: values[10],
          start_time: values[11],
          duration: Number.parseInt(values[12]),
        };
        dashboard.workflows_recents.push(workflows);
      }
    }
    return dashboard;
  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden">
        <NavDashboard />
        <div className="flex flex-col">
          <HeaderDashboard title="Dashboard" />
          <ContentDashboard dashboardData={dashboardData} />
        </div>
      </div>
    </>
  );
}
