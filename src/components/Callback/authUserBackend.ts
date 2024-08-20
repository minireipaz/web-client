import { User } from "oidc-client-ts";
import { getUriFrontend } from "../../utils/getUriFrontend";
import { ResponseSyncUser } from "../../models/Users";

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo?.access_token}`,
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

    const data: ResponseSyncUser = await response.json();
    console.log("User response:", JSON.stringify( data));
    if (data.error !== "") {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error registering user in backend:", error);
    return false;
  }
  return false;
}
