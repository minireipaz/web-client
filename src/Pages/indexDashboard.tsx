import { useEffect } from "react";
import { BrowserRouter, Routes, useNavigate, Route } from "react-router-dom";
import { useAuth } from "../components/AuthProvider/indexAuthProvider";

// import { Tooltip } from "flowbite-react";

// import { Link } from "react-router-dom";
// import { Button } from "flowbite-react";
// import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
// import { Card } from "flowbite-react";
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
  const { userInfo, handleLogout } = useAuth();

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


// function CalendarIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M8 2v4" />
//       <path d="M16 2v4" />
//       <rect width="18" height="18" x="3" y="4" rx="2" />
//       <path d="M3 10h18" />
//     </svg>
//   )
// }


// function HandHelpingIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
//       <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
//       <path d="m2 13 6 6" />
//     </svg>
//   )
// }


// function LayoutDashboardIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect width="7" height="9" x="3" y="3" rx="1" />
//       <rect width="7" height="5" x="14" y="3" rx="1" />
//       <rect width="7" height="9" x="14" y="12" rx="1" />
//       <rect width="7" height="5" x="3" y="16" rx="1" />
//     </svg>
//   )
// }


// // function LinechartChart(props: any) {
// //   return (
// //     <div {...props}>
// //       <ChartContainer
// //         config={{
// //           desktop: {
// //             label: "Desktop",
// //             color: "hsl(var(--chart-1))",
// //           },
// //         }}
// //       >
// //         <LineChart
// //           accessibilityLayer
// //           data={[
// //             { month: "January", desktop: 186 },
// //             { month: "February", desktop: 305 },
// //             { month: "March", desktop: 237 },
// //             { month: "April", desktop: 73 },
// //             { month: "May", desktop: 209 },
// //             { month: "June", desktop: 214 },
// //           ]}
// //           margin={{
// //             left: 12,
// //             right: 12,
// //           }}
// //         >
// //           <CartesianGrid vertical={false} />
// //           <XAxis
// //             dataKey="month"
// //             tickLine={false}
// //             axisLine={false}
// //             tickMargin={8}
// //             tickFormatter={(value) => value.slice(0, 3)}
// //           />
// //           <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
// //           <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
// //         </LineChart>
// //       </ChartContainer>
// //     </div>
// //   )
// // }


// function MenuIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <line x1="4" x2="20" y1="12" y2="12" />
//       <line x1="4" x2="20" y1="6" y2="6" />
//       <line x1="4" x2="20" y1="18" y2="18" />
//     </svg>
//   )
// }


// function MountainIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
//     </svg>
//   )
// }


// function SettingsIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
//       <circle cx="12" cy="12" r="3" />
//     </svg>
//   )
// }


// function WorkflowIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <rect width="8" height="8" x="3" y="3" rx="2" />
//       <path d="M7 11v4a2 2 0 0 0 2 2h4" />
//       <rect width="8" height="8" x="13" y="13" rx="2" />
//     </svg>
//   )
// }


// function XIcon(props: any) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   )
// }
