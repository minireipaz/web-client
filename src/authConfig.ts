import { ZitadelConfig } from '@zitadel/react';

export const authConfig: ZitadelConfig = {
  authority: import.meta.env.VITE_AUTHORITY, //Replace this with your issuer URL
  client_id: import.meta.env.VITE_CLIENT_ID, //Replace this with your client id
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  response_type: import.meta.env.VITE_RESPONSE_TYPE,
  scope: import.meta.env.VITE_SCOPE, // Replace ...org:project:id:PROJECT_ID:aud
  post_logout_redirect_uri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI,
  response_mode: import.meta.env.VITE_RESPONSE_MODE,
};
