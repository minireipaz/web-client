import { useEffect, useState } from "react";
import { UserManager, User } from "oidc-client-ts";
import { useNavigate } from "react-router-dom";

interface Props {
  authenticated: boolean | null;
  setAuth: (authenticated: boolean | null) => void;
  userManager: UserManager;
  handleLogout: any;
};

export default function Callback({ authenticated, setAuth, userManager }: Props) {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleAuthentication();
  }, [authenticated]);

  async function handleAuthentication() {
    if (authenticated === null) {
      try {
        const user: User = await userManager.signinRedirectCallback();
        if (user) {
          setAuth(true);
          setUserInfo(user);
        } else {
          setAuth(false);
        }
      } catch (error) {
        setAuth(false);
      }
    }

    if (authenticated === true && userInfo === null) {
      try {
        const user: User = await userManager.getUser() as User;
        if (user) {
          setAuth(true);
          setUserInfo(user);
        } else {
          setAuth(false);
        }
      } catch (error) {
        setAuth(false);
      }
    }
  }

  useEffect(() => {
    if (authenticated === true && userInfo) {
      navigate('/dashboard', { state: { userInfo } });
    }
  }, [authenticated, userInfo, navigate]);

  if (authenticated === true && userInfo) {
    return <div>Redirecting to dashboard...</div>;
  } else {
    return <div>Loading...</div>;
  }
}
