import { ReactNode } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/indexAuthProvider.tsx";
import Login from "../Login/indexLogin.tsx";
import Callback from "../Callback/indexCallback.tsx";
import Dashboard from "../../Pages/indexDashboard.tsx";
import { Workflows } from "../../Pages/indexWorkflows.tsx";
import { WorkflowDetails } from "../../Pages/indexWorkflowDetail.tsx";
import { UserManager } from "oidc-client-ts";
import { Credentials } from "../../Pages/indexCredentials.tsx";
import { OAuthCallBack } from "../Callback/oauthCallback.tsx";

// const ProtectedRoute = ({ children }: { children: ReactNode }) => {
//   const { authenticated, loading, userInfo } = useAuth();

//   if (loading) {
//     return <div>Loading protected route...</div>;
//   }

//   if (!authenticated || !userInfo) {
//     return <Navigate to="/" replace />;
//   }

//   return <>{children}</>;
// };

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export function AppRouter() {
  const {
    authenticated,
    setAuthenticated,
    handleLogin,
    handleLogout,
    userManager,
    loading,
    userInfo,
  } = useAuth();

  if (loading) {
    return <div>Loading approuter...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              userInfo={userInfo}
              authenticated={authenticated}
              handleLogin={handleLogin}
            />
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflows"
          element={
            <ProtectedRoute>
              <Workflows />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflow/"
          element={
            <ProtectedRoute>
              <WorkflowDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workflow/:uuid"
          element={
            <ProtectedRoute>
              <WorkflowDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credentials"
          element={
            <ProtectedRoute>
              <Credentials />
            </ProtectedRoute>
          }
        />
        {/* client side */}
        <Route
          path="/oauth2-credential/callback"
          element={
            // <ProtectedRoute>
            <OAuthCallBack />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
