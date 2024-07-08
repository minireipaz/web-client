import React, { createContext, useContext, useState, useEffect } from "react";
import { createZitadelAuth } from "@zitadel/react";
import { UserManager, User } from "oidc-client-ts";
import { authConfig } from "../../authConfig.ts";

interface AuthContextProps {
  authenticated: boolean | null;
  userManager: UserManager | null;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
  userInfo: User | null;
  handleLogout: () => Promise<void>;
  handleLogin: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const zitadel = createZitadelAuth(authConfig);

export function AuthProvider({ children }: any) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userManager, setUserManager] = useState<UserManager | null>(zitadel.userManager as unknown as UserManager);

  useEffect(() => {
    handleAuthentication();
  }, [authenticated, userInfo]);

  async function handleAuthentication() {
    if (authenticated === null) {
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
        setAuthenticated(false);
      }
    }

    if (authenticated === true && userInfo === null) {
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
        setAuthenticated(false);
      }
    }
  }

  async function handleLogout() {
    await zitadel.signout();
    setAuthenticated(false);
    setUserInfo(null);
    setUserManager(null);
  }

  function handleLogin() {
    zitadel.authorize();
  }

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, userInfo, handleLogout, handleLogin, userManager }}>
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
