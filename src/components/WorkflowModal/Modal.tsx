import { Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { RenderGoogleSheetsOAuth2Api } from "../Credentials/GoogleSheetsOAuth2Api";
import { GoogleSheetsModalContent } from "./GoogleSheetModal";
import { Node } from '@xyflow/react';
import { DEFAULT_CREDENTIAL_REDIRECT_PATH, DEFAULT_CREDENTIAL_TITLES, ModalCredentialData } from "../../models/Credential";
import { getLocalUri } from "../../utils/getUriFrontend";
import { ModalCredential } from "../Credentials/ModalCredential";
import { useAuth } from "../AuthProvider/indexAuthProvider";

interface ContainerProps {
  isOpen: boolean;
  dataNode: Node;
  credentials: ModalCredentialData[];
  onSave: (newCredentialData: ModalCredentialData) => void;
  onClose: () => void;
}

export const defaultCredential: ModalCredentialData = {
  id: "none",
  type: "none",
  alertMessage: <></>,
  workflowid: "",
  nodeid: "",
  sub: "",
  name: "Select credential",
  data: {
    clientId: "",
    clientSecret: "",
    redirectURL: "",
    code: "",
    scopes: [""],
    state: "",
    token: "",
    tokenrefresh: "",
  },
};

export type CredentialComponent = React.ComponentType<{
  credential: ModalCredentialData;
  onChange: (field: keyof ModalCredentialData, value: any) => void;
}>;

type ModalComponent = React.ComponentType<{
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
}>;


export function WorkflowModal(props: ContainerProps) {
  const [currentCredential, setCurrentCredential] = useState<ModalCredentialData>(defaultCredential);
  const [listCredentials, setListCredentials] = useState<ModalCredentialData[]>([defaultCredential]);
  const [pollMode, setPollMode] = useState('none');
  const [selectDocument, setSelectDocument] = useState('byuri');
  const [document, setDocument] = useState('');
  const [selectSheet, setSelectSheet] = useState('byname');
  const [sheet, setSheet] = useState('');
  const [operation, setOperation] = useState('getallcontent');
  const [currentCredentialComponent, setCurrentCredentialComponent] = useState<CredentialComponent | null>(null);
  const [CurrentModalComponent, setCurrentModalComponent] = useState<ModalComponent | null>(null);
  const [content, setContent] = useState<React.ReactElement>();
  const [sizeModal, setSizeModal] = useState("xl");
  const { userInfo } = useAuth();

  const [isModalCredentialOpen, setIsModalCredentialOpen] = useState(false);


  useEffect(() => {
    if (!props.dataNode) return;
    if (props.dataNode.data.type === "googlesheets") {
      setCurrentCredentialComponent(() => RenderGoogleSheetsOAuth2Api);
      setCurrentModalComponent(() => GoogleSheetsModalContent);
      setListCredentials(props.credentials);

    }
    initialSetCredentialForNode();
    // changeCredentialProperties();
  }, [props.dataNode]);

  function handleSelectDocument(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectDocument(event.target.value);
    setDocument("");
  }

  function handleDocument(event: React.ChangeEvent<HTMLInputElement>) {
    setDocument(event.target.value);
  }

  function handleSelectSheet(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectSheet(event.target.value);
    setSheet("");
  }

  function handleSheet(event: React.ChangeEvent<HTMLInputElement>) {
    setSheet(event.target.value);
  }

  function handleOperation(event: React.ChangeEvent<HTMLSelectElement>) {
    setOperation(event.target.value);
  }

  function handleTest(_: React.MouseEvent) {
    setSizeModal("7xl");

    setContent(
      <>
        <div className="w-full  h-auto p-2 border border-black-400 text-black " id="content" aria-hidden="true">
          !"#!"#!"#!"#
        </div>
      </>
    );

  }

  function handlClose() {
    setSizeModal("xl");
    setContent(<></>);
    props.onClose();
  }

  function handleOpenCredential() {
    changeCredentialProperties();
    setIsModalCredentialOpen(true);
  }

  function updateCredentialProperties(
    prevCredential: ModalCredentialData,
    nodeData: { type: string; nodeid: string; workflowid: string },
    userInfo?: any
  ): ModalCredentialData {
    // extract the node type, node ID, and workflow ID from the node data
    // this data is used to override necesary data to mantain cohesion
    const { type: nodeType, nodeid, workflowid } = nodeData;
    const newTitle = DEFAULT_CREDENTIAL_TITLES[nodeType] || DEFAULT_CREDENTIAL_TITLES.default;
    const oAuthRedirect = getOAuthRedirect(nodeType);

    return {
      ...prevCredential,
      name: newTitle,
      type: nodeType,
      nodeid: nodeid,
      workflowid: workflowid,
      sub: userInfo?.profile.sub || prevCredential.sub,
      data: {
        ...prevCredential.data,
        redirectURL: oAuthRedirect,
      },
    };
  }

  function initialSetCredentialForNode() {
    if (!props.dataNode.data) return;

    const { credential: selectedCredential } = props.dataNode.data as { credential: ModalCredentialData; };

    if (selectedCredential && selectedCredential.id !== "none") {
      setCurrentCredential(selectedCredential);
      return;
    }

    const updatedCredential = updateCredentialProperties(defaultCredential,
      props.dataNode.data as {
        type: string;
        nodeid: string;
        workflowid: string;
        credential: ModalCredentialData;
      }, userInfo
    );
    setCurrentCredential(updatedCredential);
  }

  function changeCredentialProperties() {
    if (currentCredential.id !== "none") return;

    const updatedCredential = updateCredentialProperties(
      currentCredential,
      props.dataNode.data as {
        type: string;
        nodeid: string;
        workflowid: string;
        credential: ModalCredentialData;
      }, userInfo);
    setCurrentCredential(updatedCredential);
  }

  function getOAuthRedirect(nodeType: string) {
    const oauthRedirect = DEFAULT_CREDENTIAL_REDIRECT_PATH[nodeType] || DEFAULT_CREDENTIAL_REDIRECT_PATH.default;
    const [ok, uriRedirect] = getLocalUri(oauthRedirect);
    if (!ok) {
      return ""
    }
    return uriRedirect;
  }

  function handleCloseModalCredential() {
    setIsModalCredentialOpen(false);
  }

  function handleSaveModalCredential(newCredential: ModalCredentialData) {
    const updatedListCredentials = handleSearchDuplicated(newCredential)
    setListCredentials(updatedListCredentials);
    setCurrentCredential(newCredential);
    setIsModalCredentialOpen(false);
    props.onSave(newCredential);
  }

  function handleSearchDuplicated(newCredential: ModalCredentialData) {
    const updatedListCredentials = [...listCredentials];
    const index = updatedListCredentials.findIndex(
      cred => cred.id === newCredential.id
    );
    if (index !== -1) {
      updatedListCredentials[index] = {
        ...updatedListCredentials[index],
        ...newCredential
      };
    } else {
      updatedListCredentials?.push(newCredential);
    }
    return updatedListCredentials;
  }

  function handleSetCredential(event: React.ChangeEvent<HTMLSelectElement>) {
    if (!listCredentials) return;
    const index = event.target.selectedIndex;
    // if (index === 0) { setCurrentCredential(defaultCredential); return; }
    setCurrentCredential(listCredentials[index]);
  }

  if (!props.dataNode) return (<></>);

  return (
    <>
      <form action="#">
        <Modal show={props.isOpen} onClose={handlClose} size={sizeModal} position="center-left">
          <Modal.Header className="h-[60px]">{props.dataNode.data.label as string}</Modal.Header>
          <Modal.Body className="flex flex-row gap-x-4">
            {CurrentModalComponent && (
              <CurrentModalComponent
                currentCredential={currentCredential}
                listCredentials={listCredentials}
                pollMode={pollMode}
                selectDocument={selectDocument}
                document={document}
                selectSheet={selectSheet}
                sheet={sheet}
                operation={operation}
                onCredentialChange={handleSetCredential}
                onPollModeChange={(e) => setPollMode(e.target.value)}
                onOperationChange={handleOperation}
                onSelectDocumentChange={handleSelectDocument}
                onDocumentChange={handleDocument}
                onSelectSheetChange={handleSelectSheet}
                onSheetChange={handleSheet}
                onOpenCredential={handleOpenCredential}
              />
            )}
            {content}
          </Modal.Body>
          <Modal.Footer className="flex flex-row justify-between h-[60px]">
            <Button onClick={handlClose} color="green">Save</Button>
            <Button color="blue" onClick={handleTest}>Test</Button>
          </Modal.Footer>
        </Modal>
        {isModalCredentialOpen && (
          <ModalCredential
            isOpen={isModalCredentialOpen}
            onClose={handleCloseModalCredential}
            onSave={handleSaveModalCredential}
            initialCredential={currentCredential}
            renderBody={currentCredentialComponent as CredentialComponent}
          />
        )}

      </form>
    </>
  );
}
