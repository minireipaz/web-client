import { Alert, Button, Label, TextInput } from "flowbite-react";
import { ModalCredentialData, CredentialData } from "../../models/Credential";
import { getLocalUri as getLocalRelativeUri } from "../../utils/getUriFrontend";
import { useMemo } from "react";

export interface CredentialState {
  code: string;
  state: string;
  scope: string[];
}

export function RenderGoogleSheetsOAuth2Api({
  credential,
  onChange
}: {
  credential: ModalCredentialData;
  onChange: (field: keyof ModalCredentialData, value: any) => void; // info is sended to handleTemplateInputsChange in file ModalCredential.tsx
}) {

  function handleDataChange(field: keyof CredentialData, value: any) {
    onChange('data', {
      ...credential.data,
      [field]: value
    });
  };

  const redirectURI = useMemo(() => {
    let redirectURI = credential.data.redirectURL;

    if (redirectURI.includes("localhost:3010")) {
      const [ok, relURI] = getLocalRelativeUri(redirectURI);
      if (!ok) return null;
      redirectURI = relURI;
    }
    return `${import.meta.env.VITE_EVENTS_ORIGIN}${redirectURI}`;
  }, [credential.data.redirectURL]);

  return (
    <ul className="ml-4 flex flex-col items-start justify-start gap-y-4 text-black ">
      {(credential.alertMessage) ? credential.alertMessage : <></> }
      <li className="flex flex-col justify-center w-full">
        <Label htmlFor="oauthredirect" value="OAuth Redirect URL" />
        <div className="flex flex-row justify-center gap-x-2">
          <TextInput id="oauthredirect" className="w-full" value={redirectURI as string} type="text" sizing="sm" readOnly />
          <Button onClick={() => navigator.clipboard.writeText(redirectURI as string)} color="green" size="sm" className="h-9">Copy</Button>
        </div>
      </li>
      <li className="flex flex-col justify-center w-full">
        <Label htmlFor="titleoauth" value="Custom Name Client OAuth" />
        <TextInput
          id="name"
          className="w-full"
          type="text"
          sizing="sm"
          value={credential.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("name", e.target.value)}
          placeholder="Custom Name Client OAuth"
          maxLength={150}
          minLength={3}
          required
        />
      </li>
      <li className="flex flex-col justify-center w-full">
        <span className="flex flex-row gap-x-[2px]">
          <Label htmlFor="clientId" value="Client ID OAuth" />
          <span className="text-[#cc2d17]">*</span>
        </span>
        <TextInput
          id="clientId"
          className="w-full"
          value={credential.data.clientId}
          type="text"
          sizing="sm"
          // onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("clientId", e.target.value)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleDataChange("clientId", e.target.value)
          }
          placeholder="Client ID OAuth"
          required
        />
      </li>
      <li className="flex flex-col justify-center w-full">
        <span className="flex flex-row gap-x-[2px]">
          <Label htmlFor="clientSecret" value="Client Secret OAuth" />
          <span className="text-[#cc2d17]">*</span>
        </span>
        <TextInput
          id="clientSecret"
          className="w-full"
          type="text"
          sizing="sm"
          value={credential.data.clientSecret}
          // onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("clientSecret", e.target.value)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleDataChange("clientSecret", e.target.value)
          }
          placeholder="Client Secret OAuth"
          required
        />
      </li>
      <li>
        <Alert color="info">
          <span className="font-medium">
            <ul className="flex flex-col gap-y-1">
              <li>
                Make sure you enabled the following APIs & Services in the Google Cloud Console:
              </li>
              <li className="flex flex-row gap-x-1">
                - <a href="https://console.cloud.google.com/apis/library/drive.googleapis.com" target="_blank" className="flex flex-row items-center gap-x-1 ">
                  Google Drive API
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="#000"><path d="M7.05 1.536a5.243 5.243 0 0 1 7.414 7.414L12.415 11 11 9.586l2.05-2.05A3.243 3.243 0 0 0 8.464 2.95L6.414 5 5 3.586l2.05-2.05ZM7.536 13.05 9.586 11 11 12.414l-2.05 2.05A5.243 5.243 0 0 1 1.536 7.05L3.586 5 5 6.414l-2.05 2.05a3.243 3.243 0 0 0 4.586 4.586Z" /><path d="m5.707 11.707 6-6-1.414-1.414-6 6 1.414 1.414Z" /></g></svg>
                </a>
              </li>
              <li className="flex flex-row gap-x-1">
                - <a href="https://console.cloud.google.com/apis/library/sheets.googleapis.com" target="_blank" className="flex flex-row items-center gap-x-1 ">
                  Google Sheets API
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="#000"><path d="M7.05 1.536a5.243 5.243 0 0 1 7.414 7.414L12.415 11 11 9.586l2.05-2.05A3.243 3.243 0 0 0 8.464 2.95L6.414 5 5 3.586l2.05-2.05ZM7.536 13.05 9.586 11 11 12.414l-2.05 2.05A5.243 5.243 0 0 1 1.536 7.05L3.586 5 5 6.414l-2.05 2.05a3.243 3.243 0 0 0 4.586 4.586Z" /><path d="m5.707 11.707 6-6-1.414-1.414-6 6 1.414 1.414Z" /></g></svg>
                </a>
              </li>
              <li>
                <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" className="flex flex-row items-center gap-x-1 ">
                  Configured OAuth consent screen
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="#000"><path d="M7.05 1.536a5.243 5.243 0 0 1 7.414 7.414L12.415 11 11 9.586l2.05-2.05A3.243 3.243 0 0 0 8.464 2.95L6.414 5 5 3.586l2.05-2.05ZM7.536 13.05 9.586 11 11 12.414l-2.05 2.05A5.243 5.243 0 0 1 1.536 7.05L3.586 5 5 6.414l-2.05 2.05a3.243 3.243 0 0 0 4.586 4.586Z" /><path d="m5.707 11.707 6-6-1.414-1.414-6 6 1.414 1.414Z" /></g></svg>
                </a>
              </li>
              <li className="flex flex-row gap-x-1">
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="flex flex-row items-center gap-x-1 ">
                  Created Credentials OAuth 2.0 Client IDs
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="#000"><path d="M7.05 1.536a5.243 5.243 0 0 1 7.414 7.414L12.415 11 11 9.586l2.05-2.05A3.243 3.243 0 0 0 8.464 2.95L6.414 5 5 3.586l2.05-2.05ZM7.536 13.05 9.586 11 11 12.414l-2.05 2.05A5.243 5.243 0 0 1 1.536 7.05L3.586 5 5 6.414l-2.05 2.05a3.243 3.243 0 0 0 4.586 4.586Z" /><path d="m5.707 11.707 6-6-1.414-1.414-6 6 1.414 1.414Z" /></g></svg>
                </a>
              </li>
            </ul>
          </span>
        </Alert>
      </li>
    </ul>
  );
}


export function ProcessGoogleOAuthMessage(data: string): CredentialState | undefined {
  if (!data.includes("?state=") && !data.includes("?code=") && !data.includes("?scope=")) return undefined;

  const params = new URLSearchParams(data);
  const scopesStr = params.get("scope");
  const scopes = scopesStr?.split(",");

  console.log("scopesStr=" + scopesStr)
  return {
    code: params.get("code") || "",
    state: params.get("state") || "",
    scope: scopes || [""]
  };
}
