import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Login/indexLogin.tsx";
import Callback from "../Callback/indexCallback.tsx";
import Dashboard from "../../Pages/indexDashboard.tsx";
import { useAuth } from "../AuthProvider/indexAuthProvider.tsx";
import { UserManager } from 'oidc-client-ts';
import { Workflows } from "../../Pages/indexWorkflows.tsx";

export function Header() {
  const { authenticated, setAuthenticated, handleLogin, handleLogout, userManager } = useAuth();
  return (
    <>
      <header className="">
        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/" element={<Login authenticated={authenticated} handleLogin={handleLogin} />} />
            <Route path="/callback" element={
              <Callback
                authenticated={authenticated as boolean}
                setAuth={setAuthenticated}
                handleLogout={handleLogout}
                userManager={userManager as UserManager}
              />
            } />
          </Routes>
        </BrowserRouter>
      </header>
    </>
  );
}
