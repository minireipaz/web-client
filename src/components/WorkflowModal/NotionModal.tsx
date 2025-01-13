import { useMemo } from "react";
import { ModalCredentialData } from "../../models/Credential";
import { ResponseSaveFormData } from "./Modal";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { FormData } from '../../models/Workflow';

interface NotionModalProps {
  currentCredential: ModalCredentialData;
  listCredentials: ModalCredentialData[];
  formData: FormData;
  onCredentialChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onPollModeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onOperationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSelectDocumentChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onDocumentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectSheetChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onSheetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenCredential: () => void;
}

interface NotionButtonProps {
  handleTest: (dataResponse: ResponseSaveFormData) => void;
  showAlert: (title: string, color: string) => void;
  formData: FormData;
  dataNode: Record<string, unknown>;
}


export function NotionModal(props: NotionModalProps) {
  function transformCredentialsInOptions() {
    let recentCredentials = [];
    for (let i = 0; i < props.listCredentials.length; i++) {
      const element = props.listCredentials[i];
      recentCredentials.push(
        <option key={element.id} value={element.id}>
          {element.name}
        </option>
      );
    }
    return recentCredentials;
  }

  const MemoizedLabelCredential = useMemo(
      () => <Label htmlFor="credential" value="Credential to connect with" />,
      []
    );

    const MemoizedButtonCredential = useMemo(
      () => (
        <Button
          className="whitespace-nowrap w-max"
          onClick={props.onOpenCredential}
        >
          {props.currentCredential?.id !== 'none' ? 'Edit' : 'New'} Credential
        </Button>
      ),
      [props.onOpenCredential, props.currentCredential?.id]
    );

    const MemoizedLabelPollMode = useMemo(
      () => <Label htmlFor="pollMode" value="Poll Times" />,
      []
    );

    const MemoizedLabelOperation = useMemo(
      () => <Label htmlFor="document" value="Operation" />,
      []
    );

    const MemoizedLabelDocument = useMemo(
      () => <Label htmlFor="document" value="Document" />,
      []
    );

    const MemoizedLabelSheet = useMemo(
      () => <Label htmlFor="sheet" value="Sheet" />,
      []
    );

  return (
      <div className="w-full">
        <input
          type="hidden"
          name="nodeid"
          value={props.currentCredential.nodeid}
        />
        <input
          type="hidden"
          name="workflowid"
          value={props.currentCredential.workflowid}
        />
        <input type="hidden" name="type" value={props.currentCredential.type} />
        <input
          type="hidden"
          name="redirecturl"
          value={props.currentCredential.data.redirectURL}
        />
        <ul className="flex flex-col gap-y-5">
          <li className="flex flex-col">
            {MemoizedLabelCredential}
            <div className="flex flex-row gap-x-2 items-center">
              <Select
                id="credential"
                name="credential"
                className="w-full"
                value={props.currentCredential?.id}
                onChange={props.onCredentialChange}
                required
              >
                {transformCredentialsInOptions()}
              </Select>
              {MemoizedButtonCredential}
            </div>
          </li>

          <li className="flex flex-col justify-center">
            {MemoizedLabelPollMode}
            <div className="flex flex-row gap-x-2 items-center">
              <Select
                id="pollMode"
                name="pollmode"
                className="w-full"
                value={props.formData.pollmode}
                onChange={props.onPollModeChange}
              >
                <option value="none">None</option>
                <option value="everyminute">Every Minute</option>
                <option value="everyfiveminute">Every 5 Minutes</option>
              </Select>
            </div>
          </li>

          <li className="flex flex-col justify-center">
            {MemoizedLabelOperation}
            <div className="flex flex-row gap-x-2 items-center">
              <Select
                id="operation"
                name="operation"
                className="w-full"
                value={props.formData.operation}
                onChange={props.onOperationChange}
              >
                <option value="getallcontent">Get All Content</option>
                <option value="byothers">By Others...</option>
              </Select>
            </div>
          </li>

          <li className="flex flex-col justify-center">
            {MemoizedLabelDocument}
            <div className="flex flex-row gap-x-2 items-center">
              <Select
                id="selectdocument"
                name="selectdocument"
                className="w-1/3"
                value={props.formData.selectdocument || 'byuri'}
                onChange={props.onSelectDocumentChange}
              >
                <option value="byuri">By URL</option>
                <option value="byothers">By Others...</option>
              </Select>
              <TextInput
                id="document"
                name="document"
                className="w-full"
                value={props.formData.document as string}
                onChange={props.onDocumentChange}
                placeholder={
                  props.formData.selectdocument === 'byuri'
                    ? 'Enter URL'
                    : 'Not Implemented'
                }
              />
            </div>
          </li>

          <li className="flex flex-col justify-center">
            {MemoizedLabelSheet}
            <div className="flex flex-row gap-x-2 items-center">
              <Select
                id="selectsheet"
                name="selectsheet"
                className="w-1/3"
                value={props.formData.selectsheet}
                onChange={props.onSelectSheetChange}
              >
                <option value="byname">By Name</option>
                <option value="byothers">Others...</option>
              </Select>
              <TextInput
                id="sheet"
                name="sheet"
                className="w-full"
                value={props.formData.sheet}
                onChange={props.onSheetChange}
                placeholder={
                  props.formData.selectsheet === 'byname'
                    ? 'Enter Name'
                    : 'Not Implemented'
                }
              />
            </div>
          </li>
        </ul>
      </div>
    );
}
