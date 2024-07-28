import { User } from "oidc-client-ts";
import { NavigateFunction } from "react-router-dom";
import { getUriFrontend } from "../../utils/getUriFrontend";
import { ResponseCreateUser } from "../../models/Users";

export async function registerUserInBackend(userInfo: User | null, navigate: NavigateFunction) {
  const failConnection: ResponseCreateUser = {
    error: "Conexion error",
    status: 500,
  };

  if (!userInfo || !userInfo?.profile.sub || userInfo?.profile.sub == "") {
    return [false, failConnection];
  }
  try {
    const [ok, uriFrontend] = getUriFrontend("/api/users");
    if (!ok) {
      return [false, failConnection];
    }
    const response = await fetch(uriFrontend, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userInfo?.profile.sub,
      }),
    });

    if (!response.ok) {
      // TODO: better redirect
      navigate('/');
    }

    const data = await response.json();
    console.log('User registered successfully:', data);
  } catch (error) {
    console.error('Error registering user in backend:', error);
    navigate('/');
  }
}
