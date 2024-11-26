import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, UserManager } from 'oidc-client-ts';
import { ensureUserExists } from '../Callback/authUserBackend';
import { authConfig } from "../../authConfig.ts";
import { createZitadelAuth } from "@zitadel/react";

interface AuthContextType {
  authenticated: boolean | null;
  loading: boolean;
  userInfo: User | null;
  userManager: UserManager | null;
  setAuthenticated: (auth: boolean | null) => void;
  handleLogin: () => void;
  handleLogout: () => void;
  setUserAndValidate: (user: User) => Promise<boolean>;
  handleTokenExpiration: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const zitadel = createZitadelAuth(authConfig);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userValidated, setUserValidated] = useState(false);
  const [userManager, setUserManager] = useState<UserManager | null>(zitadel.userManager as unknown as UserManager);
  const fetchedRef = useRef(false);

  const setUserAndValidate = async (user: User): Promise<boolean> => {
    try {
      const [isValid, isExpired] = await ensureUserExists(user);
      if (isExpired) {
        await handleTokenExpiration();
        return false;
      }
      if (isValid) {
        setUserInfo(user);
        setAuthenticated(true);
        setUserValidated(true);
      }
      return isValid;
    } catch (error) {
      console.error('Error validating user:', error);
      return false;
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const checkAuth = async () => {
      try {
        const user = await userManager?.getUser();
        if (user && !user.expired) {
          await setUserAndValidate(user);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    userManager?.signinRedirect();
  };

  const handleLogout = async () => {
  setAuthenticated(false);
  setUserInfo(null);
  setUserValidated(false);
  fetchedRef.current = false;
  await userManager?.removeUser();
  userManager?.signoutRedirect();
  };

  async function handleTokenExpiration() {
    await zitadel.userManager.removeUser();
    setAuthenticated(false);
    setUserInfo(null);
    setUserManager(null);
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        loading,
        userInfo,
        userManager,
        setAuthenticated,
        handleLogin,
        handleLogout,
        setUserAndValidate,
        handleTokenExpiration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
