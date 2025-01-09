import { Alert, Button, Modal } from 'flowbite-react';
import React, { useEffect, useState, useCallback } from 'react';
import { RenderGoogleSheetsOAuth2Api } from '../Credentials/GoogleSheetsOAuth2Api';
import {
  GoogleSheetButton,
  GoogleSheetsModalContent,
} from './GoogleSheetModal';
import { Node } from '@xyflow/react';
import {
  COLOR_ALERTS,
  DEFAULT_CREDENTIAL_REDIRECT_PATH,
  DEFAULT_CREDENTIAL_TITLES,
  ModalCredentialData,
} from '../../models/Credential';
import { ModalCredential } from '../Credentials/ModalCredential';
import { useAuth } from '../AuthProvider/indexAuthProvider';
import { FormData } from '../../models/Workflow';

interface ContainerProps {
  isOpen: boolean;
  dataNode: Node;
  credentials: ModalCredentialData[];
  onUpdateNode: (newCredentialData: ModalCredentialData) => void;
  onSaveModal: (formData: FormData, dataNode: Node) => Promise<boolean | undefined>;
  onClose: () => void;
}

interface NodeData {
  type: string;
  nodeid: string;
  workflowid: string;
  credential: ModalCredentialData;
  formdata: FormData;
}

export const defaultFormModal: FormData = {
  pollmode: 'none',
  selectdocument: 'byuri',
  document: '',
  selectsheet: 'byname',
  sheet: '',
  operation: 'getallcontent',
  credentialid: '',
  sub: '',
  type: '',
  workflowid: '',
  nodeid: '',
  redirecturl: '',
  testmode: false,
};

export const defaultCredential: ModalCredentialData = {
  id: 'none',
  type: 'none',
  alertMessage: <></>,
  workflowid: '',
  nodeid: '',
  sub: '',
  name: 'Select credential',
  data: {
    clientId: '',
    clientSecret: '',
    redirectURL: '',
    code: '',
    scopes: [''],
    state: '',
    // token: '',
    // tokenrefresh: '',
  },
};

export type CredentialComponent = React.ComponentType<{
  credential: ModalCredentialData;
  onChange: (field: keyof ModalCredentialData, value: any) => void;
}>;

type ModalComponent = React.ComponentType<{
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
}>;

type ModalButtonComponent = React.ComponentType<{
  handleTest: (dataResponse: ResponseSaveFormData) => void;
  formData: FormData;
  dataNode: Record<string, unknown>;
  showAlert: (title: string, color: string) => void;
}>;

export interface ResponseSaveFormData {
  status: number;
  error: string;
  data: string;
}

export const enum ERRORTEXT {
  notvalidurl = 'Not valid URL in Document',
  notvalidoptiondocument = 'Select Document not valid option',
  notsavedyet = "Already not saved",
  notsaved = "Not Saved!",
  saved = "Saved"
}

export function WorkflowModal(props: ContainerProps) {
  const [currentCredential, setCurrentCredential] =
    useState<ModalCredentialData>(defaultCredential);
  const [listCredentials, setListCredentials] = useState<ModalCredentialData[]>(
    [...props.credentials]
  );
  const [currentCredentialComponent, setCurrentCredentialComponent] =
    useState<CredentialComponent | null>(null);
  const [CurrentModalComponent, setCurrentModalComponent] =
    useState<ModalComponent | null>(null);
  const [CurrentButtonComponent, setCurrentButtonComponent] =
    useState<ModalButtonComponent | null>(null);
  const [contentTest, setContentTest] = useState<React.ReactElement>();
  const [sizeModal, setSizeModal] = useState('xl');
  const { userInfo } = useAuth();
  const [alertMessage, setAlertMessage] = useState(<></>);
  // set default values from formularyData btw
  // already setted in WorkflowDrawer
  // TODO: maybe later can be removed
  const [formularyData, setFormularyData] = useState<FormData>(defaultFormModal);

  const [isModalCredentialOpen, setIsModalCredentialOpen] = useState(false);

  // default relative paths from diferent type providers
  const getRedirectURL = useCallback((nodeType: string) => {
    const uriRedirect =
      DEFAULT_CREDENTIAL_REDIRECT_PATH[nodeType] ||
      DEFAULT_CREDENTIAL_REDIRECT_PATH.default;
    return uriRedirect;
  }, []);

  const updateCredentialProperties = useCallback(
    (
      prevCredential: ModalCredentialData,
      nodeData: { type: string; nodeid: string; workflowid: string },
      userInfo?: any
    ): ModalCredentialData => {
      // extract the node type, node ID, and workflow ID from the node data
      // this data is used to override necessary data to maintain cohesion
      const { type, nodeid, workflowid } = nodeData;
      const newTitle =
        DEFAULT_CREDENTIAL_TITLES[type] || DEFAULT_CREDENTIAL_TITLES.default;
      const redirectURL = getRedirectURL(type);
      // TODO: improve
      return {
        ...prevCredential,
        name: newTitle,
        type: type,
        nodeid: nodeid,
        workflowid: workflowid,
        sub: userInfo?.profile.sub || prevCredential.sub,
        data: {
          ...prevCredential.data,
          redirectURL: redirectURL,
        },
      };
    },
    [getRedirectURL]
  );

  // const initialSetCredentialForNode = useCallback(() => {
  //   if (!props.dataNode || !props.dataNode.data) return;

  //   const { credential: selectedCredential, formdata: currentFormData } = props.dataNode.data as { credential: ModalCredentialData; formdata: FormData };
  //   if (!currentFormData) {
  //     setFormData(formData)
  //   } else {
  //     setFormData({ ...currentFormData });
  //   }
  //   if (selectedCredential && selectedCredential.id !== "none") {
  //     setCurrentCredential(selectedCredential);
  //     return;
  //   }
  //   // TODO: maybe not needed
  //   const updatedCredential = updateCredentialProperties(defaultCredential,
  //     props.dataNode.data as {
  //       type: string;
  //       nodeid: string;
  //       workflowid: string;
  //       credential: ModalCredentialData;
  //       formdata: FormData;
  //     }, userInfo
  //   );
  //   setCurrentCredential(updatedCredential);
  // }, [props.dataNode, updateCredentialProperties, userInfo, formData]);

  // Update the initialSetCredentialForNode function
  const initialSetCredentialForNode = useCallback(() => {
    if (!props.dataNode || !props.dataNode.data) return;
    // unkown because props.dataNode is Record<string, unkown>
    // nodeData used
    const nodeData = props.dataNode.data as unknown as NodeData;
    const { credential, formdata } = nodeData;

    // merge formdata with default values
    // values with "" replaced with default value
    // default formdata gets from workflowdrawer.tsx
    // TODO: maybe later not necesary to do this
    const mergedData = mergeFormData(formularyData, formdata);
    setFormularyData({ ...mergedData });

    // if already credential exist in nodedata
    if (credential.id) {
      if (credential && credential.id !== 'none') {
        setCurrentCredential(credential);
        return;
      }
    }

    // not exist credential, just show default credential
    const updatedCredential = updateCredentialProperties(
      defaultCredential,
      nodeData,
      userInfo
    );
    setCurrentCredential(updatedCredential);
  }, [props.dataNode, updateCredentialProperties, userInfo, formularyData]);

  function mergeFormData(defaultValues: FormData, formdata: FormData) {
    const mergedData = { ...defaultValues };
    Object.keys(formdata).forEach((key) => {
      if (formdata[key] !== '') {
        mergedData[key] = formdata[key];
      }
    });
    return mergedData;
  }

  useEffect(() => {
    if (!props.dataNode) return;
    if (props.dataNode.data.type === 'googlesheets') {
      setCurrentCredentialComponent(() => RenderGoogleSheetsOAuth2Api);
      setCurrentModalComponent(() => GoogleSheetsModalContent);
      setCurrentButtonComponent(() => GoogleSheetButton);
      // if (listCredentials.length === 1 )
      // setListCredentials(props.credentials);
    }
    initialSetCredentialForNode();
  }, [props.dataNode
    //  ,props.credentials
    ]);

  const handleInputChange = useCallback((event: any) => {
    setFormularyData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleTest = useCallback((dataResponse: ResponseSaveFormData) => {
    setSizeModal('7xl');
    // const valuesRaw = JSON.parse(dataResponse.data);
    console.log('response=' + JSON.stringify(dataResponse));
    setContentTest(
      <>
        <div
          className="w-full h-auto p-2 border border-black-400 text-black"
          id="content"
          aria-hidden="true"
        >
          {dataResponse.data}
        </div>
      </>
    );
  }, []);

  const handleClose = useCallback(() => {
    setSizeModal('xl');
    setContentTest(<></>);
    setFormularyData(defaultFormModal);
    props.onClose();
  }, [props]);

  const handleSave = useCallback(async () => {
    // shows error message
    if (!validateForm(formularyData)) {
      return;
    }

    setFormularyData({
      ...formularyData,
    });
    // console.log("formData=" + JSON.stringify(formData))
    const updated = await props.onSaveModal(formularyData, props.dataNode);
    if (!updated) {
      showAlert(ERRORTEXT.notsaved, COLOR_ALERTS.failure);
    } else {
      showAlert(ERRORTEXT.saved, COLOR_ALERTS.ok);
    }
  }, [props, formularyData]);

  function validateForm(formData: FormData): boolean {
    if (formData.credentialid === '' || formData.credentialid === "none") {
      showAlert('Select valid credential', COLOR_ALERTS.failure);
      return false;
    }

    if (formData.sheet !== '') {
      showAlert("sheet name not implemented", COLOR_ALERTS.failure);
      return false;
    }

    if (
      formData.selectdocument !== 'byuri' &&
      formData.selectdocument !== 'byothers'
    ) {
      showAlert(ERRORTEXT.notvalidoptiondocument, COLOR_ALERTS.failure);
      return false;
    }

    if (formData.document !== '') {
      try {
        if (!URL.canParse(formData.document)) {
          showAlert(ERRORTEXT.notvalidurl, COLOR_ALERTS.failure);
          return false;
        }
        // if (formData.sheet !== '') {
        //   showAlert("sheet name not implemented", COLOR_ALERTS.failure);
        //   return false;
        // }
      } catch (error) {
        showAlert(ERRORTEXT.notvalidurl, COLOR_ALERTS.failure);
        return false;
      }
    }

    return true;
  }

  const changeCredentialProperties = useCallback(() => {
    if (currentCredential.id !== 'none') return;
    if (!props.dataNode.data) return;

    const updatedCredential = updateCredentialProperties(
      currentCredential,
      props.dataNode.data as {
        type: string;
        nodeid: string;
        workflowid: string;
        credential: ModalCredentialData;
        formdata: FormData;
      },
      userInfo
    );

    setFormularyData({
      ...formularyData,
      credentialid: updatedCredential.id,
      sub: updatedCredential.sub,
      type: updatedCredential.type,
      workflowid: updatedCredential.workflowid,
      nodeid: updatedCredential.nodeid,
      redirecturl: updatedCredential.data.redirectURL,
    });
    setCurrentCredential(updatedCredential);
  }, [currentCredential, updateCredentialProperties, userInfo, formularyData]);

  const handleOpenCredential = useCallback(() => {
    changeCredentialProperties();
    setIsModalCredentialOpen(true);
  }, [changeCredentialProperties]);

  const handleCloseModalCredential = useCallback(() => {
    setIsModalCredentialOpen(false);
  }, []);

  const handleInsertCredentialInList = useCallback(
    (newCredential: ModalCredentialData) => {
      const updatedListCredentials = [...listCredentials];
      const index = updatedListCredentials.findIndex(
        (cred) => cred.id === newCredential.id
      );
      if (index !== -1) {
        updatedListCredentials[index] = {
          ...updatedListCredentials[index],
          ...newCredential,
        };
      } else {
        updatedListCredentials?.push(newCredential);
      }
      return updatedListCredentials;
    },
    [listCredentials]
  );

  const handleSaveModalCredential = useCallback(
    (newCredential: ModalCredentialData) => {
      const updatedListCredentials = handleInsertCredentialInList(newCredential);
      setListCredentials(updatedListCredentials);
      setCurrentCredential(newCredential);
      setFormularyData({
        ...formularyData,
        credentialid: newCredential.id,
        sub: newCredential.sub,
        type: newCredential.type,
        workflowid: newCredential.workflowid,
        nodeid: newCredential.nodeid,
        redirecturl: newCredential.data.redirectURL,
      });
      setIsModalCredentialOpen(false);
      props.onUpdateNode(newCredential);
    },
    [handleInsertCredentialInList, props, formularyData]
  );

  const handleSetCredential = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (!listCredentials) return;
      const index = event.target.selectedIndex;
      const newCredential = listCredentials[index];
      setCurrentCredential(newCredential);
      props.onUpdateNode(newCredential); // podria ser no necesario
      setFormularyData({
        ...formularyData,
        credentialid: newCredential.id,
        sub: newCredential.sub,
        type: newCredential.type,
        workflowid: newCredential.workflowid,
        nodeid: newCredential.nodeid,
        redirecturl: newCredential.data.redirectURL,
      });
    },
    [listCredentials, formularyData]
  );

  const showAlert = useCallback((title: string, color: string) => {
    setAlertMessage(
      <>
        <Alert color={color} className="w-full">
          <span className="font-medium">{title.toString()}.</span>
        </Alert>
      </>
    );
    setTimeout(() => {
      setAlertMessage(<></>);
    }, 2000);
  }, []);

  // const currentCredentialMemo = useMemo(
  //   () => currentCredential,
  //   [currentCredential]
  // );

  if (!props.dataNode) return <></>;

  return (
    <>
      <form action="#">
        <Modal
          show={props.isOpen}
          onClose={handleClose}
          size={sizeModal}
          position="center-left"
        >
          <Modal.Header className="h-[60px]">
            {props.dataNode.data.label as string}
          </Modal.Header>
          <Modal.Body className="flex flex-row gap-x-4">
            {CurrentModalComponent && (
              <CurrentModalComponent
                currentCredential={currentCredential}
                listCredentials={listCredentials}
                formData={formularyData}
                onCredentialChange={handleSetCredential}
                onPollModeChange={handleInputChange}
                onOperationChange={handleInputChange}
                onSelectDocumentChange={handleInputChange}
                onDocumentChange={handleInputChange}
                onSelectSheetChange={handleInputChange}
                onSheetChange={handleInputChange}
                onOpenCredential={handleOpenCredential}
              />
            )}
            {contentTest}
          </Modal.Body>
          <Modal.Footer className="flex flex-row justify-between h-[60px]">
            <Button onClick={handleSave} color="green">
              Save
            </Button>
            {alertMessage}
            {CurrentButtonComponent && (
              <CurrentButtonComponent
                showAlert={showAlert}
                handleTest={handleTest}
                dataNode={props.dataNode.data}
                formData={formularyData}
              />
            )}
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
