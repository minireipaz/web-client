// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Login from "../Login/indexLogin.tsx";
// import Callback from "../Callback/indexCallback.tsx";
// import Dashboard from "../../Pages/indexDashboard.tsx";
// import { useAuth } from "../AuthProvider/indexAuthProvider.tsx";
// import { UserManager } from 'oidc-client-ts';
// import { Workflows } from "../../Pages/indexWorkflows.tsx";
// import { WorkflowDetails } from "../../Pages/indexWorkflowDetail.tsx";
import { AppRouter } from "../AuthProvider/Approuter.tsx";

export function Header() {
  // const { authenticated, setAuthenticated, handleLogin, handleLogout, userManager } = useAuth();
  return (
    <>
      <header className="">
      </header>
      <AppRouter />
    </>
  );
}
