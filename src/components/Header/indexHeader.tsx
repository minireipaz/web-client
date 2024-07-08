import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../Login/indexLogin.tsx";
import Callback from "../Callback/indexCallback.tsx";
import Dashboard from '../Dashboard/indexDashboard.tsx';
import { useAuth } from "../AuthProvider/indexAuthProvider.tsx";
import { UserManager } from 'oidc-client-ts';

export function Header() {
  const { authenticated, setAuthenticated, handleLogin, handleLogout, userManager } = useAuth();
  return (
    <>
      <header className="">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Login authenticated={authenticated} handleLogin={handleLogin} />
              }
            />
            <Route
              path="/callback"
              element={
                <Callback
                  authenticated={authenticated as boolean}
                  setAuth={setAuthenticated}
                  handleLogout={handleLogout}
                  userManager={userManager as UserManager}
                />
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </header>
    </>
  );
}
