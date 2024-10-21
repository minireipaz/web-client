import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/indexAuthProvider.tsx";
import Login from "../Login/indexLogin.tsx";
import Callback from "../Callback/indexCallback.tsx";
import Dashboard from "../../Pages/indexDashboard.tsx";
import { Workflows } from "../../Pages/indexWorkflows.tsx";
import { WorkflowDetails } from "../../Pages/indexWorkflowDetail.tsx";
import { UserManager } from 'oidc-client-ts';
import { Credentials } from '../../Pages/indexCredentials.tsx';
import { ensureUserExists } from "../Callback/authUserBackend.ts";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, loading, userInfo, handleLogout } = useAuth();

  useEffect(() => {
    if (!authenticated || !userInfo) return;

    const checkUser = async () => {
      try {
        const isOk = await ensureUserExists(userInfo);
        if (!isOk) {
          handleLogout();
        }
      } catch (error) {
        console.error('Error checking user existence:', error);
        handleLogout();
      }
    };

    checkUser();
  }, [authenticated, userInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>{children}</>
  );;
};

export function AppRouter() {
  const { authenticated, setAuthenticated, handleLogin, handleLogout, userManager, loading, userInfo } = useAuth();

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login userInfo={userInfo} authenticated={authenticated} handleLogin={handleLogin} />} />
        <Route path="/callback" element={
          <Callback
            authenticated={authenticated as boolean}
            setAuth={setAuthenticated}
            handleLogout={handleLogout}
            userManager={userManager as UserManager}
          />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/workflows" element={
          <ProtectedRoute>
            <Workflows />
          </ProtectedRoute>
        } />
        <Route path="/workflow/" element={
          <ProtectedRoute>
            <WorkflowDetails />
          </ProtectedRoute>
        } />
        <Route path="/workflow/:uuid" element={
          <ProtectedRoute>
            <WorkflowDetails />
          </ProtectedRoute>
        } />
        <Route path="/credentials" element={
          <ProtectedRoute>
            <Credentials />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
