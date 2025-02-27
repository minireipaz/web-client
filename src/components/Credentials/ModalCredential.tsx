import { Alert, Button, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  COLOR_ALERTS,
  CredentialData,
  DEFAULT_CREDENTIAL_REDIRECT_PATH,
  ModalCredentialData,
  ResponseCreateCredential,
} from "../../models/Credential";
import { getUriFrontend } from "../../utils/getUriFrontend";
import { useAuth } from "../AuthProvider/indexAuthProvider";
import { OAuthProvider, PostMessageData } from "../Callback/oauthCallback";
import {
  CredentialState,
  ProcessGoogleOAuthMessage,
} from "./GoogleSheetsOAuth2Api";
import { useRequest } from "../../utils/requests";
import { ReactFlowInstance, Node } from "@xyflow/react";
import { ProcessNotionToken } from "./NotionInternalAuthApi";

interface ContainerProps {
  flowInstance: ReactFlowInstance | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (credential: ModalCredentialData) => void;
  initialCredential: ModalCredentialData;
  renderBody: React.ComponentType<{
    credential: ModalCredentialData;
    onChange: (field: keyof ModalCredentialData, value: any) => void;
  }>;
}

export function ModalCredential(props: ContainerProps) {
  const { userInfo, handleTokenExpiration } = useAuth();
  const [credential, setCredential] = useState<ModalCredentialData>({
    id: "",
    type: "",
    alertMessage: <></>,
    nodeid: "",
    workflowid: "",
    sub: "",
    name: "",
    data: {
      clientId: "",
      clientSecret: "",
      redirectURL: "https://example.com/oauth/redirect",
      code: "",
      scopes: [""],
      state: "",
    } as CredentialData,
  });

  type OAuthHandler = (param: string) => CredentialState | undefined;
  const oauthHandlers: Record<OAuthProvider, OAuthHandler> = {
    google: ProcessGoogleOAuthMessage,
    notion: ProcessNotionToken, // for internal secret not used pattern oauth2
    // github: () => {},
    // microsoft: () => {},
    // facebook: () => {},
  };

  const [disabledButtonTest, setDisabledButtonTest] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { executeRequest, cancelRequest } = useRequest();
  const [messageSaved, setMessageSaved] = useState(<></>);

  const failConnection: ResponseCreateCredential = {
    error: "Conexion error",
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
    value: any,
  ) {
    setCredential(prev => ({
      ...prev,
      [field]: value,
    }));
  }
  // this function in case cannot parse uniqueid
  // from backend
  function generateTemporalUniqueId(): string {
    // TODO: uuid more short?
    return `credential_${userInfo?.profile.sub}_${credential.workflowid}_${credential.nodeid}_${credential.type}`;
  }

  async function handleTestCredentials() {
    if (!checkValidations(credential)) return;
    setDisabledButtonTest(true);
    try {
      abortControllerRef.current = new AbortController();
      const [isOk, response] = await collectCredentials(
        credential,
        abortControllerRef.current.signal,
      );

      if (!isOk) {
        setDisabledButtonTest(false);
        showAlert("Cannot connect", COLOR_ALERTS.failure);
        return;
      }
      // oauth redirect
      if (response.auth_url !== undefined && response.auth_url !== "") {
        openNewWindow(response.auth_url as string);
        return;
      }
      // token credential
      if (!response.data) {
        setDisabledButtonTest(false);
        showAlert("Cannot connect", COLOR_ALERTS.failure);
        return;
      }
      const ok = await handleTokenCredential(response.data);
      if (!ok) {
        console.error("Cannot parse token credential:", response.data);
        showAlert("Error testing credential", COLOR_ALERTS.failure);
        return;
      }
      return;
    } catch (error: any) {
      setDisabledButtonTest(false);
      if (error.name === "AbortError") {
        return console.log("canceled");
      }
      console.error("Error Testing:", error);
      showAlert("Error testing credential", COLOR_ALERTS.failure);
      return;
    }
  }

  async function handleTokenCredential(data: string): Promise<boolean> {
    const parsedData = parseDataResponseFromTokenCredential(data as string);
    if (!parsedData) return false;
    await handleUpdateCredential(credential, parsedData as ModalCredentialData);
    return true;
  }

  function openNewWindow(url: string) {
    if (!url || url === "") {
      return;
    }

    const authWindow = window.open(
      url,
      "popup",
      "width=400,height=600,left=100,top=0",
    );
    if (!authWindow) {
      console.error("Cannot open window");
      setDisabledButtonTest(false);
      return;
    }

    window.addEventListener("message", handleMessagesOAuthCredentials);
    setTimeout(() => {
      setDisabledButtonTest(false);
    }, 2000);
  }

  async function handleMessagesOAuthCredentials(event: MessageEvent<any>) {
    if (event.origin !== import.meta.env.VITE_EVENTS_ORIGIN) {
      // TODO: 401
      console.error("Not authorized", event.origin);
      return;
    }
    if (!window.location.href.includes("/workflow/")) return;
    const { type, data: stateStr, provider } = event.data as PostMessageData;
    if (type !== "oauthmessage") return;
    if (!stateStr) return;
    const result = oauthHandlers[provider as OAuthProvider](stateStr);
    if (!result) return;
    window.removeEventListener("message", handleMessagesOAuthCredentials);
    await handleSaveCredentials(result);
    console.log("Mensaje recibido:", event.data);
  }

  function parseDataResponseFromTokenCredential(
    dataStr: string,
  ): ModalCredentialData {
    const data: ModalCredentialData = JSON.parse(dataStr);
    return data;
  }

  function checkValidations(credential: ModalCredentialData) {
    // TODO: dummy checks
    if (credential.name.trim() === "") {
      showAlert("Custom Name Client OAuth is required", COLOR_ALERTS.failure);
      return false;
    }

    if (
      credential.name.trim().length < 3 ||
      credential.name.trim().length > 150
    ) {
      showAlert(
        "Custom Name Client OAuth must be between 3 and 150 characters",
        COLOR_ALERTS.failure,
      );
      return false;
    }
    // checking with url redirects btw can be used options crdential.options
    if (
      DEFAULT_CREDENTIAL_REDIRECT_PATH[credential.type] !== undefined &&
      DEFAULT_CREDENTIAL_REDIRECT_PATH[credential.type] !== ""
    ) {
      if (credential.data.clientId.trim() === "") {
        showAlert("Client ID OAuth is required", COLOR_ALERTS.failure);
        return false;
      }
    }

    // check OAUthURL

    if (credential.data.clientSecret.trim() === "") {
      showAlert("Client Secret OAuth is required", COLOR_ALERTS.failure);
      return false;
    }

    return true;
  }

  function showAlert(title: string, color: string) {
    setMessageSaved(
      <>
        <Alert color={color} className="w-full">
          <span className="font-medium">{title.toString()}.</span>
        </Alert>
      </>,
    );

    setTimeout(() => {
      setMessageSaved(<></>);
    }, 5000);
  }

  function checkRedirectURLOAuth(credential: ModalCredentialData) {
    // DEFAULT_CREDENTIAL_REDIRECT_PATH only relative uris
    const defaultPath =
      DEFAULT_CREDENTIAL_REDIRECT_PATH[credential.type] ||
      DEFAULT_CREDENTIAL_REDIRECT_PATH.default;
    if (defaultPath) {
      return credential.data.redirectURL.trim() !== "";
    }
    return false;
  }

  async function collectCredentials(
    credential: ModalCredentialData,
    signal?: AbortSignal,
  ): Promise<[boolean, ResponseCreateCredential]> {
    try {
      const isValidOAuth = checkRedirectURLOAuth(credential);
      // select api path based in oauth validation
      const apiPath = isValidOAuth
        ? "/api/v1/oauth-credentials"
        : "/api/v1/credentials";

      const [ok, uriFrontend] = getUriFrontend(apiPath);
      if (!ok) {
        return [false, failConnection];
      }

      const body = createBodyForCredential(credential);
      const response = await fetch(uriFrontend, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        body: JSON.stringify(body),
        signal,
      });
      // contaiminated context
      if (response.status === 401) {
        handleTokenExpiration();
        return [false, failConnection];
        //   navigate("/", { replace: true });
        //   return [false, failConnection];
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
      console.error("cannot send credentials:", error);
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
    credentialState: CredentialState,
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
      },
    };
  }

  // this function recives state from credential
  // this state will send to frontend to recreate credential
  // throught state
  async function handleSaveCredentials(
    credentialState: CredentialState | undefined,
  ) {
    if (!checkValidations(credential)) return;
    if (!credentialState) return;
    setDisabledButtonTest(false);

    // logic inser/update decopled in backend logic
    // here needs to modify if its needed decoupled from client side
    try {
      const result = await executeRequest(
        async signal => {
          return await sendNewCredential(credential, credentialState, signal);
        },
        {
          onSuccess: () => {
            console.log("ok");
          },
          onError: error => {
            console.error("Error Testing:", error);
            showAlert("Error testing credential", COLOR_ALERTS.failure);
          },
          onFinally: () => {
            // removed for more granular control over button test
            // setDisabledButtonTest(false);
          },
        },
      );

      if (!result) {
        return;
      }

      const [isOk, dataResponse, newCredential] = result;
      if (!isOk) {
        showAlert("Cannot connect", COLOR_ALERTS.failure);
        return;
      }
      // update credential and workflow
      await handleUpdateCredential(
        newCredential as ModalCredentialData,
        dataResponse as ModalCredentialData,
      );
    } catch (error: any) {
      setDisabledButtonTest(false);
      if (error.name === "AbortError") {
        return console.log("canceled");
      }
      console.error("Error Testing:", error);
      return showAlert("Error testing credential", "failure");
    }
  }

  async function handleUpdateCredential(
    newCredential: ModalCredentialData,
    responseData: ModalCredentialData,
  ) {
    if (!checkValidations(credential)) return;

    let newId =
      credential.id && credential.id !== "none"
        ? credential.id
        : (responseData.id as string);

    // in case not parsed correctly
    if (!newId || newId === "undefined") {
      newId = generateTemporalUniqueId();
    }
    // merge returned credential and client credential
    const mergedCredential = mergeCredentials(
      newCredential,
      responseData,
      newId,
    );

    directUpdateNodes(mergedCredential);
    // called to update:
    // listcredentials
    // currentcredential
    // formularydata
    // updatenode
    props.onSave(mergedCredential);
    setDisabledButtonTest(false);
  }

  function mergeCredentials(
    newCredential: ModalCredentialData,
    responseData: ModalCredentialData,
    newId: string,
  ) {
    let mergedCredential = {
      ...newCredential,
      id: newId,
      data: {
        ...responseData.data,
      },
    };
    if (responseData.data.redirectURL === "") {
      mergedCredential = {
        ...newCredential,
        id: newId,
        data: {
          ...newCredential.data,
        },
      };
    }
    return mergedCredential;
  }

  // not necesarry fields for ModalCredentialData
  // "oauthurl"
  // "code"
  // "codeverifier"
  // "token"
  // "tokenrefresh"
  function directUpdateNodes(credential: ModalCredentialData) {
    if (!props.flowInstance) return;
    const originalNode = props.flowInstance.getNode(credential.nodeid);
    if (!originalNode) return;
    const updatedNode = updateNodeByNodeID(originalNode, credential);
    if (!updatedNode) return;
    props.flowInstance.updateNodeData(credential.nodeid, updatedNode, {
      replace: true,
    });
  }

  function updateNodeByNodeID(
    originalNode: Node,
    credential: ModalCredentialData,
  ): Node | undefined {
    if (originalNode.id !== credential.nodeid) return undefined;
    return {
      ...originalNode,
      data: {
        ...originalNode.data,
        credential: { ...credential },
      },
    };
  }

  async function sendNewCredential(
    credential: ModalCredentialData,
    credentialState: CredentialState,
    signal?: AbortSignal,
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
        credentialState,
      );
      const response = await fetch(uriFrontend, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        body: JSON.stringify(body),
        signal,
      });

      if (response.status === 401) {
        handleTokenExpiration();
        return [false, undefined, undefined];
        //   navigate("/", { replace: true });
        //   return [false, undefined, undefined];
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
      console.log("error", error);
      return [false, undefined, undefined];
    }
  }

  if (credential.id === "") return <></>;

  return (
    <>
      <Modal
        show={props.isOpen}
        onClose={props.onClose}
        position="top-right"
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
