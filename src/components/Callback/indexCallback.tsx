import { useEffect, useState } from "react";
import { UserManager, User } from "oidc-client-ts";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { ensureUserExists } from "./authUserBackend";

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
    // if (authenticated === null) {
    //   handleAuthentication();
    // }
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
      checkUserExist(userInfo);
    }
    // checkUserExist(authenticated, userInfo, navigate)
  }, [authenticated, userInfo, navigate]);

  // async function checkUserExist(authenticated: boolean | null, userInfo: User | null, navigate: NavigateFunction) {
  //   if (authenticated === true && userInfo) {
  //     const isOk = await userAutenticate(userInfo);;
  //     if (!isOk) {
  //       authenticated = false;
  //       return;
  //     }
  //     navigate('/dashboard', { state: { userInfo } });
  //   }

  // }

  async function checkUserExist(user: User) {
    const isOk = await ensureUserExists(user);
    if (isOk) {
      navigate('/dashboard', { state: { userInfo: user } });
    } else {
      setAuth(false);
    }
  }

  if (authenticated === true && userInfo) {
    return <div>Redirecting to dashboard...</div>;
  } else {
    return <div>Loading...</div>;
  }
}
