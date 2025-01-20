import { CredentialData, ModalCredentialData } from "../../models/Credential";
import { Alert, Label, TextInput } from "flowbite-react";

export interface CredentialState {
  code: string;
  state: string;
  scope: string[];
}

export function ProcessNotionToken(): CredentialState | undefined {
  // not implemented
  return undefined;
}

export function RenderNotionApi({
  credential,
  onChange,
}: {
  credential: ModalCredentialData;
  onChange: (field: keyof ModalCredentialData, value: any) => void; // info is sended to handleTemplateInputsChange in file ModalCredential.tsx
}) {
  function handleDataChange(field: keyof CredentialData, value: any) {
    onChange("data", {
      ...credential.data,
      [field]: value,
    });
  }

  return (
    <ul className="ml-4 flex flex-col items-start justify-start gap-y-4 text-black ">
      <li className="flex flex-col justify-center w-full">
        <span className="flex flex-row gap-x-[2px]">
          <Label htmlFor="titleoauth" value="Custom Name Token" />
          <span className="text-[#cc2d17]">*</span>
        </span>
        <TextInput
          id="name"
          className="w-full"
          type="text"
          sizing="sm"
          value={credential.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("name", e.target.value)
          }
          placeholder="Custom Name Token"
          maxLength={150}
          minLength={3}
          required
        />
      </li>

      <li className="flex flex-col justify-center w-full">
        <span className="flex flex-row gap-x-[2px]">
          <Label htmlFor="clientSecret" value="Internal Integration Secret" />
          <span className="text-[#cc2d17]">*</span>
        </span>
        <TextInput
          id="clientSecret"
          className="w-full"
          type="text"
          sizing="sm"
          value={credential.data.clientSecret}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleDataChange("clientSecret", e.target.value)
          }
          placeholder="Internal Integration Secret"
          required
        />
      </li>
      <li>
        <Alert color="info">
          <span className="font-medium">
            <ul className="flex flex-col gap-y-1">
              <li>Make sure you have configured:</li>
              <li className="flex flex-row gap-x-1">
                -{" "}
                <a
                  href="https://www.notion.so/profile/integrations"
                  target="_blank"
                  className="flex flex-row items-center gap-x-1 "
                  rel="noreferrer"
                >
                  Secret Notion Integration API
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="#000">
                      <path d="M7.05 1.536a5.243 5.243 0 0 1 7.414 7.414L12.415 11 11 9.586l2.05-2.05A3.243 3.243 0 0 0 8.464 2.95L6.414 5 5 3.586l2.05-2.05ZM7.536 13.05 9.586 11 11 12.414l-2.05 2.05A5.243 5.243 0 0 1 1.536 7.05L3.586 5 5 6.414l-2.05 2.05a3.243 3.243 0 0 0 4.586 4.586Z" />
                      <path d="m5.707 11.707 6-6-1.414-1.414-6 6 1.414 1.414Z" />
                    </g>
                  </svg>
                </a>
              </li>
              <li className="flex flex-row gap-x-1">
                -{" "}
                <a
                  href="https://www.notion.so/profile/integrations"
                  target="_blank"
                  className="flex flex-row items-center gap-x-1 "
                  rel="noreferrer"
                >
                  Needed Permisions
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="#000">
                      <path d="M7.05 1.536a5.243 5.243 0 0 1 7.414 7.414L12.415 11 11 9.586l2.05-2.05A3.243 3.243 0 0 0 8.464 2.95L6.414 5 5 3.586l2.05-2.05ZM7.536 13.05 9.586 11 11 12.414l-2.05 2.05A5.243 5.243 0 0 1 1.536 7.05L3.586 5 5 6.414l-2.05 2.05a3.243 3.243 0 0 0 4.586 4.586Z" />
                      <path d="m5.707 11.707 6-6-1.414-1.414-6 6 1.414 1.414Z" />
                    </g>
                  </svg>
                </a>
              </li>
            </ul>
          </span>
        </Alert>
      </li>
      {credential.alertMessage}
    </ul>
  );
}
