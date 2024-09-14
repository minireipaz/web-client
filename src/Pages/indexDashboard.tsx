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
import { DashboardData, RecenWorkflows, ResponseDashboardData, WorkflowCounts } from "../models/Dashboard";
import { getUriFrontend } from "../utils/getUriFrontend";

let isFetchingData = false;

export default function Dashboard() {
  const navigate = useNavigate();
  const { authenticated, userInfo } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!authenticated || !userInfo) {
      navigate("/");
    } else {
      if (!isFetchingData) {
        isFetchingData = true;
        fetchDashboardData();
      }
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
  }

  function convertDashboardData(responseData: ResponseDashboardData): DashboardData {
    let dashboard: DashboardData =  {
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

        let workflows: RecenWorkflows = {
          id: values[0],
          workflow_name: values[1],
          workflow_description: values[2],
          status: values[3],
          is_active: values[4],
          start_time: values[5],
          duration: values[6],
        };
        dashboard.workflows_recents.push(workflows);
      }


    }
    return dashboard;
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


// import React, { useEffect, useState, createContext, useContext, useMemo, ReactNode } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { SWRConfig } from 'swr';
// import { NavDashboard } from '../components/Dashboard/NavDashboard';
// import { HeaderDashboard } from '../components/Dashboard/HeaderDashboard';
// import { QuickActions } from '../components/Cards/QuickActions';
// import { RecentActivity } from '../components/Cards/RecentActivity';
// import { TotalWorkflows } from '../components/Cards/TotalWorkflows';
// import { SuccessWorkflows } from '../components/Cards/SuccessWorkflows';
// import { FailedWorkflows } from '../components/Cards/FailedWorkflows';
// import { PendingWorkflows } from '../components/Cards/PendingWorkflows';
// import { RecentWorkflows } from '../components/Cards/RecentWorkflows';
// import { DashboardData, UserInfo } from '../models/Dashboard';
// import { getUriFrontend } from '../utils/getUriFrontend';

// // Tipos
// type QueryError = {
//   status: number;
//   message: string;
// };

// type AuthContextType = {
//   authenticated: boolean;
//   userInfo: UserInfo | null;
// };

// type DashboardContextType = {
//   dashboardData: DashboardData | null;
//   error: QueryError | null;
//   setError: (error: QueryError | null) => void;
// };

// // Contextos
// const AuthContext = createContext<AuthContextType | null>(null);
// const DashboardContext = createContext<DashboardContextType | null>(null);

// // Hooks personalizados
// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// };

// const useDashboard = () => {
//   const context = useContext(DashboardContext);
//   if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
//   return context;
// };

// // Componente principal
// const Dashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { authenticated, userInfo } = useAuth();
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [error, setError] = useState<QueryError | null>(null);

//   const dashboardContextValue = useMemo(() => ({ dashboardData, error, setError }), [dashboardData, error]);

//   useEffect(() => {
//     if (!authenticated || !userInfo) {
//       navigate('/');
//     } else {
//       fetchDashboardData();
//     }
//   }, [authenticated, userInfo, navigate]);

//   const fetchDashboardData = async () => {
//     try {
//       const [ok, uriFrontend] = getUriFrontend(`/api/dashboard/${userInfo?.profile.sub}`);
//       if (!ok) return;

//       const response = await fetch(uriFrontend, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${userInfo?.access_token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data: DashboardData = await response.json();
//       setDashboardData(data);
//     } catch (error) {
//       setDashboardData(null);
//       setError({ status: 500, message: 'Error fetching dashboard data' });
//       console.error('Error fetching dashboard data:', error);
//     }
//   };

//   if (!authenticated || !userInfo) {
//     return <div>Redirecting...</div>;
//   }

//   return (
//     <SWRConfig
//       value={{
//         revalidateOnFocus: false,
//         refreshInterval: 120000,
//         dedupingInterval: 0,
//         revalidateOnMount: true,
//         onError: (error: QueryError) => {
//           if (error.status === 401 || error.status === 403) {
//             setError(error);
//           }
//         },
//       }}
//     >
//       <DashboardContext.Provider value={dashboardContextValue}>
//         <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden">
//           <NavDashboard />
//           <div className="flex flex-col">
//             <HeaderDashboard title="Dashboard" />
//             <div className="flex-1 grid grid-cols-[240px_1fr] gap-6 p-6">
//               <div className="flex flex-col gap-6">
//                 <QuickActions />
//                 <RecentActivity />
//               </div>
//               <div className="grid gap-6">
//                 <div className="grid grid-cols-2 gap-6">
//                   <TotalWorkflows />
//                   <SuccessWorkflows />
//                   <FailedWorkflows />
//                   <PendingWorkflows />
//                 </div>
//                 <RecentWorkflows />
//               </div>
//             </div>
//           </div>
//         </div>
//       </DashboardContext.Provider>
//     </SWRConfig>
//   );
// };

// export default Dashboard;
