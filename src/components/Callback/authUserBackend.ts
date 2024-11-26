import { User } from "oidc-client-ts";
import { getUriFrontend } from "../../utils/getUriFrontend";
import { ResponseSyncUser } from "../../models/Users";
let calling = 0;
const userTokenExpired = "token expired"

export async function ensureUserExists(userInfo: User | null): Promise<[boolean, boolean]> {
  if (!userInfo || !userInfo?.profile.sub || userInfo?.profile.sub == "" || userInfo.access_token == "") {
    return [false, true];
  }
  try {
    console.log("calling=" + calling);
    calling++;
    const [ok, uriFrontend] = getUriFrontend("/api/users");
    if (!ok) {
      return [false, true];
    }
    const response = await fetch(uriFrontend, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo?.access_token}`,
      },
      body: JSON.stringify({
        user_id: userInfo?.profile.sub,
        access_token: userInfo.access_token,
      }),
    });

    if (!response.ok) {
      // TODO: better redirect
      return [false, true];
    }

    const data: ResponseSyncUser = await response.json();
    console.log("User response:", JSON.stringify( data));
    if (response.status === 401 && data.error === userTokenExpired) {
      return [data.exist, data.expired]
    }
    if (data.error !== "") {
      return [false, true];
    }
    return [data.exist, data.expired]
  } catch (error) {
    console.error("Error registering user in backend:", error);
    return [false, true];
  }
  return [false, true];
}
