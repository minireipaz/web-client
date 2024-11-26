import { ReactElement } from "react";

export interface ResponseCreateCredential{
  error: string;
  status: number;
  data?: string;
  auth_url?: string;
  token?: string;
  tokenrefresh?: string;
}

export interface ResponseGetAllCredentials {
  error: string;
  status: number;
  credentials: ModalCredentialData[];
}

export const DEFAULT_CREDENTIAL_TITLES: Record<string, string> = {
  googlesheets: "Google Sheet OAuth",
  gmail: "Gmail OAuth",
  drive: "Google Drive OAuth",
  default: "Select credential"
};

export const DEFAULT_CREDENTIAL_REDIRECT_PATH: Record<string, string> = {
  googlesheets: "/oauth2-credential/callback",
  gmail: "",
  drive: "",
  default: "/oauth2-credential/callback"
}


export interface CredentialData {
  clientId: string;
  clientSecret: string;
  redirectURL: string;
  code: string;
  scopes: string[];
  state: string;
  token: string;
  tokenrefresh: string;
}

export interface ModalCredentialData {
  data: CredentialData;
  id: string;
  type: string;
  alertMessage: ReactElement;
  workflowid: string;
  nodeid: string;
  sub: string;
  name: string;
}
