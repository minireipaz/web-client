import { useEffect } from "react";
import { UserManager, User } from "oidc-client-ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/indexAuthProvider";

interface Props {
  authenticated: boolean | null;
  setAuth: (authenticated: boolean | null) => void;
  userManager: UserManager;
  handleLogout: any;
}

export default function Callback({
  authenticated,
  setAuth,
  userManager,
  handleLogout,
}: Props) {
  const navigate = useNavigate();
  const { setUserAndValidate } = useAuth();

  useEffect(() => {
    handleAuthentication();
  }, [authenticated]);

  async function handleAuthentication() {
    try {
      if (authenticated === null || authenticated === false) {
        const user: User = await userManager.signinRedirectCallback();
        if (user) {
          const isValid = await setUserAndValidate(user);
          if (isValid) {
            navigate("/dashboard", { state: { userInfo: user } });
          } else {
            handleLogout();
          }
        } else {
          setAuth(false);
        }
      }
    } catch (error) {
      console.log("error", error);
      setAuth(false);
    }
  }

  return <div>Loading...</div>;
}
