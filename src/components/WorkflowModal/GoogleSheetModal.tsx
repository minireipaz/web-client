import { Label, Select, TextInput, Button } from "flowbite-react";
import { ModalCredentialData } from "../../models/Credential";
import { useMemo } from "react";

interface GoogleSheetsModalProps {
  currentCredential: ModalCredentialData;
  listCredentials: ModalCredentialData[];
  pollMode: string;
  selectDocument: string;
  document: string;
  selectSheet: string;
  sheet: string;
  operation: string;
  onCredentialChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onPollModeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onOperationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSelectDocumentChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onDocumentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectSheetChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSheetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenCredential: () => void;
}

export function GoogleSheetsModalContent(props: GoogleSheetsModalProps) {

  const recentCredentials = useMemo(() => {
    let recentCredentials = [];
    for (let i = 0; i < props.listCredentials.length; i++) {
      const element = props.listCredentials[i];
      recentCredentials.push(
        <option key={element.id} value={element.id} >{element.name}</option>
      );
    }
    return recentCredentials;
  }, [props.listCredentials]);

  return (
    <div className="w-full">
      <ul className="flex flex-col gap-y-5">
        <li className="flex flex-col">
          <Label htmlFor="credential" value="Credential to connect with" />
          <div className="flex flex-row gap-x-2 items-center">
            <Select
              id="credential"
              className="w-full"
              value={props.currentCredential?.id}
              onChange={props.onCredentialChange}
              required
            >
              {recentCredentials}
              {/* {props.listCredentials?.map((element) => (
                <option key={element.id} value={element.id}>{element.name}</option>
              ))} */}
            </Select>
            <Button
              className="whitespace-nowrap w-max"
              onClick={props.onOpenCredential}
            >
              {props.currentCredential?.id !== "none" ? 'Edit' : 'New'} Credential
            </Button>
          </div>
        </li>

        <li className="flex flex-col justify-center">
          <Label htmlFor="pollMode" value="Poll Times" />
          <div className="flex flex-row gap-x-2 items-center">
            <Select
              id="pollMode"
              className="w-full"
              value={props.pollMode}
              onChange={props.onPollModeChange}
            >
              <option value="none">None</option>
              <option value="everyminute">Every Minute</option>
              <option value="everyfiveminute">Every 5 Minutes</option>
            </Select>
          </div>
        </li>

        <li className="flex flex-col justify-center">
          <Label htmlFor="document" value="Operation" />
          <div className="flex flex-row gap-x-2 items-center">
            <Select
              id="operation"
              className="w-full"
              value={props.operation}
              onChange={props.onOperationChange}
            >
              <option value="getallcontent">Get All Content</option>
              <option value="byothers">By Others...</option>
            </Select>
          </div>
        </li>

        <li className="flex flex-col justify-center">
          <Label htmlFor="document" value="Document" />
          <div className="flex flex-row gap-x-2 items-center">
            <Select
              id="selectdocument"
              className="w-1/3"
              value={props.selectDocument}
              onChange={props.onSelectDocumentChange}
            >
              <option value="byuri">By URL</option>
              <option value="byothers">By Others...</option>
            </Select>
            <TextInput
              id="document"
              className="w-full"
              value={props.document as string}
              onChange={props.onDocumentChange}
              placeholder={props.selectDocument === "byuri" ? "Enter URL" : "Not implemented"}
            />
          </div>
        </li>

        <li className="flex flex-col justify-center">
          <Label htmlFor="sheet" value="Sheet" />
          <div className="flex flex-row gap-x-2 items-center">
            <Select
              id="selectsheet"
              className="w-1/3"
              value={props.selectSheet}
              onChange={props.onSelectSheetChange}
            >
              <option value="byname">By Name</option>
              <option value="byothers">Others...</option>
            </Select>
            <TextInput
              id="sheet"
              className="w-full"
              value={props.sheet}
              onChange={props.onSheetChange}
              placeholder={props.selectSheet === "byname" ? "Enter Name" : "Not implemented"}
            />
          </div>
        </li>
      </ul>
    </div>
  );
}
