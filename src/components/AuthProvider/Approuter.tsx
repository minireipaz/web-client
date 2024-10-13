import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/indexAuthProvider.tsx";
import Login from "../Login/indexLogin.tsx";
import Callback from "../Callback/indexCallback.tsx";
import Dashboard from "../../Pages/indexDashboard.tsx";
import { Workflows } from "../../Pages/indexWorkflows.tsx";
import { WorkflowDetails } from "../../Pages/indexWorkflowDetail.tsx";
import { UserManager } from 'oidc-client-ts';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, loading } = useAuth();

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
      </Routes>
    </BrowserRouter>
  );
}
