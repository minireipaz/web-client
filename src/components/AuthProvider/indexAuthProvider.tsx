import React, { createContext, useContext, useState, useEffect } from "react";
import { createZitadelAuth } from "@zitadel/react";
import { UserManager, User } from "oidc-client-ts";
import { authConfig } from "../../authConfig.ts";

interface AuthContextProps {
  authenticated: boolean | null;
  userManager: UserManager | null;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>; // boolean;
  userInfo: User | null;
  handleLogout: () => Promise<void>;
  handleLogin: () => void;
  loading: boolean;
  handleTokenExpiration: () => void;
  handleSetUserInfo: (user: User) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const zitadel = createZitadelAuth(authConfig);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userManager, setUserManager] = useState<UserManager | null>(zitadel.userManager as unknown as UserManager);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user: User = await zitadel.userManager.getUser() as User;
        if (user) {
          setAuthenticated(true);
          setUserInfo(user);
          setUserManager(zitadel.userManager as unknown as UserManager);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  async function handleLogout() {
    await zitadel.signout();
    setAuthenticated(false);
    setUserInfo(null);
    setUserManager(null);
  }

  function handleSetUserInfo(user: User) {
    setUserInfo(user)
  }

  function handleLogin() {
    zitadel.authorize();
  }

  async function handleTokenExpiration() {
    await zitadel.userManager.removeUser();
    setAuthenticated(false);
    setUserInfo(null);
    setUserManager(null);
  }

  return (
    <AuthContext.Provider value={{
      authenticated,
      setAuthenticated,
      userInfo,
      handleLogout,
      handleLogin,
      userManager,
      loading,
      handleTokenExpiration,
      handleSetUserInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;

}
