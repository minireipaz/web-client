import { User } from "oidc-client-ts";
import { getUriFrontend } from "../../utils/getUriFrontend";
// import { ResponseCreateUser } from "../../models/Users";

export async function ensureUserExists(userInfo: User | null): Promise<boolean> {
  if (!userInfo || !userInfo?.profile.sub || userInfo?.profile.sub == "" || userInfo.access_token == "") {
    return false;
  }
  try {
    const [ok, uriFrontend] = getUriFrontend("/api/users");
    if (!ok) {
      return false;
    }
    const response = await fetch(uriFrontend, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sub: userInfo?.profile.sub,
        access_token: userInfo.access_token,
      }),
    });

    if (!response.ok) {
      // TODO: better redirect
      return false;
    }

    const data = await response.json();
    console.log('User response:', JSON.stringify( data));
  } catch (error) {
    console.error('Error registering user in backend:', error);
    return false;
  }
  return false;
}
