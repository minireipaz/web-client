import { Alert, Button, Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  COLOR_ALERTS,
  CredentialData,
  ModalCredentialData,
  ResponseCreateCredential,
} from '../../models/Credential';
import { getUriFrontend } from '../../utils/getUriFrontend';
import { useAuth } from '../AuthProvider/indexAuthProvider';
import { OAuthProvider, PostMessageData } from '../Callback/oauthCallback';
import {
  CredentialState,
  ProcessGoogleOAuthMessage,
} from './GoogleSheetsOAuth2Api';
import { useRequest } from '../../utils/requests';
// import { ERRORTEXT } from '../WorkflowModal/Modal';

interface ContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (credential: ModalCredentialData) => void;
  initialCredential: ModalCredentialData;
  renderBody: React.ComponentType<{
    credential: ModalCredentialData;
    onChange: (field: keyof ModalCredentialData, value: any) => void;
  }>;
  // showAlert: (title: string, color: string) => void;
}

export function ModalCredential(props: ContainerProps) {
  const { userInfo, handleTokenExpiration } = useAuth();
  const navigate = useNavigate();
  const [credential, setCredential] = useState<ModalCredentialData>({
    id: '',
    type: '',
    alertMessage: <></>,
    nodeid: '',
    workflowid: '',
    sub: '',
    name: '',
    data: {
      clientId: '',
      clientSecret: '',
      redirectURL: 'https://example.com/oauth/redirect',
      code: '',
      scopes: [''],
      state: '',
    } as CredentialData,
  });

  const oauthHandlers: Record<OAuthProvider, Function> = {
    google: ProcessGoogleOAuthMessage,
    github: () => { },
    microsoft: () => { },
    facebook: () => { },
  };

  const [disabledButtonTest, setDisabledButtonTest] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { executeRequest, cancelRequest } = useRequest();
  const [messageSaved, setMessageSaved] = useState(<></>);

  const failConnection: ResponseCreateCredential = {
    error: 'Conexion error',
    status: 500,
  };

  useEffect(() => {
    if (props.initialCredential) {
      setCredential(props.initialCredential);
    }
    return () => {
      cancelRequest(); /// cancel request but not remove operation initiated
    };
  }, [props.initialCredential]);

  function handleTemplateInputsChange(
    field: keyof ModalCredentialData,
    value: any
  ) {
    setCredential((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function generateTemporalUniqueId(): string {
    //
    return `credential_${userInfo?.profile.sub}_${credential.workflowid}_${credential.nodeid}_${credential.type}`;
  }

  async function handleTestCredentials() {
    if (!checkValidations(credential)) return;
    setDisabledButtonTest(true);
    try {
      abortControllerRef.current = new AbortController();
      const [isOk, data] = await collectCredentials(
        credential,
        abortControllerRef.current.signal
      );

      if (!isOk) {
        setDisabledButtonTest(false);
        showAlert('Cannot connect', COLOR_ALERTS.failure);
        return
      }
      openNewWindow(data.auth_url as string);
      return;
    } catch (error: any) {
      setDisabledButtonTest(false);
      if (error.name === 'AbortError') {
        return console.log('canceled');
      }
      console.error('Error Testing:', error);
      showAlert('Error testing credential', COLOR_ALERTS.failure);
      return;
    }
    return;
  }

  function openNewWindow(url: string) {
    if (!url || url === '') {
      return;
    }

    const authWindow = window.open(
      url,
      'popup',
      'width=400,height=600,left=100,top=0'
    );
    if (!authWindow) {
      console.error('Cannot open window');
      setDisabledButtonTest(false);
      return;
    }

    window.addEventListener('message', handleMessagesCredentials);
    setTimeout(() => {
      setDisabledButtonTest(false);
    }, 2000);
  }

  async function handleMessagesCredentials(event: MessageEvent<any>) {
    if (event.origin !== import.meta.env.VITE_EVENTS_ORIGIN) {
      // TODO: 401
      console.error('Not authorized', event.origin);
      return;
    }
    if (!window.location.href.includes('/workflow/')) return;
    const { type, data: stateStr, provider } = event.data as PostMessageData;
    if (type != 'oauthmessage') return;
    if (!stateStr) return;
    const result = oauthHandlers[provider as OAuthProvider](stateStr);
    if (!result) return;
    window.removeEventListener('message', handleMessagesCredentials);
    await handleSaveCredentials(result);
    console.log('Mensaje recibido:', event.data);
  }

  function checkValidations(credential: ModalCredentialData) {
    // dummy checks
    if (credential.name.trim() === '') {
      showAlert('Custom Name Client OAuth is required', COLOR_ALERTS.failure);
      return false;
    }

    if (
      credential.name.trim().length < 3 ||
      credential.name.trim().length > 150
    ) {
      showAlert(
        'Custom Name Client OAuth must be between 3 and 150 characters',
        COLOR_ALERTS.failure
      );
      return false;
    }

    if (credential.data.clientId.trim() === '') {
      showAlert('Client ID OAuth is required', COLOR_ALERTS.failure);
      return false;
    }

    if (credential.data.clientSecret.trim() === '') {
      showAlert('Client Secret OAuth is required', COLOR_ALERTS.failure);
      return false;
    }

    return true;
  }

  function showAlert(title: string, color: string) {
    // maybe not necesary
    // setCredential((prev) => ({
    //   ...prev,
    //   alertMessage: (
    //     <>
    //       <li className="w-full">
    //         <Alert color={color} className="w-full">
    //           <span className="font-medium">{title.toString()}.</span>
    //         </Alert>
    //       </li>
    //     </>
    //   ),
    // }));

    // setTimeout(() => {
    //   setCredential((prev) => ({
    //     ...prev,
    //     alertMessage: <></>,
    //   }));
    // }, 1000);

    setMessageSaved(
      <>
        <Alert color={color} className="w-full">
          <span className="font-medium">{title.toString()}.</span>
        </Alert>
      </>
    );

    setTimeout(() => {
      setMessageSaved(<></>);
    }, 2000);




  }

  async function collectCredentials(
    credential: ModalCredentialData,
    signal?: AbortSignal
  ): Promise<[boolean, ResponseCreateCredential]> {
    try {
      const [ok, uriFrontend] = getUriFrontend(`/api/v1/credentials`);
      if (!ok) {
        return [false, failConnection];
      }
      const body = createBodyForCredential(credential);
      const response = await fetch(uriFrontend, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        body: JSON.stringify(body),
        signal,
      });

      if (response.status === 401) {
        // Token maybe has expired, handle expiration and redirect
        handleTokenExpiration();
        navigate('/', { replace: true });
        return [false, failConnection];
      }

      if (!response.ok) {
        return [false, failConnection];
      }

      const data: ResponseCreateCredential = await response.json();
      if (!data || data.status !== 200) {
        return [false, failConnection];
      }
      return [true, data];
    } catch (error) {
      return [false, failConnection];
    }
  }

  function createBodyForCredential(credential: ModalCredentialData) {
    return {
      id: credential.id,
      sub: userInfo?.profile.sub,
      name: credential.name,
      type: credential.type,
      workflowid: credential.workflowid,
      nodeid: credential.nodeid,
      data: {
        clientId: credential.data.clientId,
        clientSecret: credential.data.clientSecret,
        redirectURL: credential.data.redirectURL,
      },
    };
  }

  function createBodySaveCredential(
    credential: ModalCredentialData,
    credentialState: CredentialState
  ): ModalCredentialData {
    return {
      id: credential.id, // currently is setted temp to none when saved will change ID
      alertMessage: <></>, // not needed to send
      sub: userInfo?.profile.sub as string,
      name: credential.name,
      type: credential.type,
      workflowid: credential.workflowid,
      nodeid: credential.nodeid,
      data: {
        clientId: credential.data.clientId,
        clientSecret: credential.data.clientSecret,
        redirectURL: credential.data.redirectURL,
        code: credentialState.code,
        scopes: credentialState.scope,
        state: credentialState.state,
        // token: '',
        // tokenrefresh: '',
      },
    };
  }

  // this function recives state from credential
  // this state will send to frontend to recreate credential
  // throught state
  async function handleSaveCredentials(
    credentialState: CredentialState | undefined
  ) {
    if (!checkValidations(credential)) return;
    if (!credentialState) return;
    setDisabledButtonTest(false);

    // decople insert and update
    // btw in credential datasource clickhouse use MergeTreeReplace
    // // new credential
    // if (credential.id === "none") {

    // } else {
    //   // update credential
    // }

    try {
      const result = await executeRequest(
        async (signal) => {
          return await sendNewCredential(credential, credentialState, signal);
        },
        {
          onSuccess: () => {
            console.log('ok');
          },
          onError: (error) => {
            console.error('Error Testing:', error);
            showAlert('Error testing credential', COLOR_ALERTS.failure);
          },
          onFinally: () => {
            setDisabledButtonTest(false);
          },
        }
      );

      if (!result) {
        return;
      }

      const [isOk, dataResponse, newCredential] = result;
      if (!isOk) {
        showAlert('Cannot connect', COLOR_ALERTS.failure);
        return;
      }
      handleUpdateCredential(
        newCredential as ModalCredentialData,
        dataResponse as ModalCredentialData
      );
      // showAlert('Saved', COLOR_ALERTS.ok);
      // props.showAlert(ERRORTEXT.notsavedyet, COLOR_ALERTS.warning); // si esta no funciona ningun showalert
    } catch (error: any) {
      setDisabledButtonTest(false);
      if (error.name === 'AbortError') {
        return console.log('canceled');
      }
      console.error('Error Testing:', error);
      return showAlert('Error testing credential', 'failure');
    }
  }

  async function handleUpdateCredential(
    newCredential: ModalCredentialData,
    responseData: ModalCredentialData

  ) {
    if (!checkValidations(credential)) return;

    let newId =
      credential.id && credential.id !== 'none'
        ? credential.id
        : responseData.id as string;

    // something went wrong because newid get from backend
    // maybe client cannot parsed corretly
    if (!newId || newId === "undefined") {
      newId = generateTemporalUniqueId();
    }
    // newCredential.id = newId;
    // newCredential.data = responseData.data;
    newCredential = {
      ...credential,
      id: newId,
      data: {
        ...responseData.data,
      },
    };

    props.onSave(newCredential);
  }

  async function sendNewCredential(
    credential: ModalCredentialData,
    credentialState: CredentialState,
    signal?: AbortSignal
  ): Promise<
    [boolean, ModalCredentialData | undefined, ModalCredentialData | undefined]
  > {
    try {
      const [ok, uriFrontend] = getUriFrontend(`/oauth2-credentials/save`);
      if (!ok) {
        return [false, undefined, undefined];
      }
      const body: ModalCredentialData = createBodySaveCredential(
        credential,
        credentialState
      );
      const response = await fetch(uriFrontend, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        body: JSON.stringify(body),
        signal,
      });

      if (response.status === 401) {
        // Token maybe has expired, handle expiration and redirect
        handleTokenExpiration();
        navigate('/', { replace: true });
        return [false, undefined, undefined];
      }

      if (!response.ok) {
        return [false, undefined, undefined];
      }

      const data: ModalCredentialData = await response.json();
      if (!data || data.status !== 200) {
        return [false, undefined, undefined];
      }
      return [true, data, body];
    } catch (error) {
      return [false, undefined, undefined];
    }
  }

  // function showTextMessage(msg: string) {
  //   setMessageSaved(msg);
  // }

  if (credential.id == '') return <></>;

  return (
    <>
      <Modal
        show={props.isOpen}
        onClose={props.onClose}
        position="center-right"
        size="md"
      >
        <Modal.Header className="h-[60px]">Credential</Modal.Header>
        <Modal.Body>
          <props.renderBody
            credential={credential}
            onChange={handleTemplateInputsChange}
          />
        </Modal.Body>
        <Modal.Footer className="flex flex-row justify-between h-[60px]">
          <span className="text-black">{messageSaved}</span>
          <Button
            color="blue"
            onClick={handleTestCredentials}
            disabled={disabledButtonTest}
          >
            Test & Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
