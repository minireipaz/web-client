import { Button, Label, Select, TextInput } from "flowbite-react";
import { COLOR_ALERTS, ModalCredentialData } from "../../models/Credential";
import React, { useMemo, useState } from "react";
import { useRequest } from "../../utils/requests";
import { getUriFrontend } from "../../utils/getUriFrontend";
import { ERRORTEXT, ResponseSaveFormData } from "./Modal";
import { useAuth } from "../AuthProvider/indexAuthProvider";
import { FormData } from "../../models/Workflow";
import { TypeNodes } from "../Workflow/WorkflowDrawer";

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
        </option>,
      );
    }
    return recentCredentials;
  }

  const MemoizedLabelCredential = useMemo(
    () => <Label htmlFor="credential" value="Credential to connect with" />,
    [],
  );

  const MemoizedButtonCredential = useMemo(
    () => (
      <Button
        className="whitespace-nowrap w-max"
        onClick={props.onOpenCredential}
      >
        {props.currentCredential?.id !== "none" ? "Edit" : "New"} Credential
      </Button>
    ),
    [props.onOpenCredential, props.currentCredential?.id],
  );

  const MemoizedLabelPollMode = useMemo(
    () => <Label htmlFor="pollMode" value="Poll Times" />,
    [],
  );

  const MemoizedLabelOperation = useMemo(
    () => <Label htmlFor="document" value="Operation" />,
    [],
  );

  const MemoizedLabelDocument = useMemo(
    () => <Label htmlFor="document" value="Document" />,
    [],
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
              value={props.formData.selectdocument || "byuri"}
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
                props.formData.selectdocument === "byuri"
                  ? "Enter URL"
                  : "Not Implemented"
              }
            />
          </div>
        </li>
      </ul>
    </div>
  );
}

export function NotionButton(props: NotionButtonProps) {
  const { userInfo } = useAuth();
  const [disabledButtonTest, setDisabledButtonTest] = useState(false);
  const { executeRequest } = useRequest();
  const failConnection: ResponseSaveFormData = {
    error: "Conexion error",
    status: 500,
    data: "",
  };
  const MAX_ATTEMPTS = 11;
  const DELAY = 1_000; // 1sec

  async function handleSubmitTest(event: any) {
    event.preventDefault();
    if (
      props.dataNode.type !== TypeNodes.notiontoken &&
      props.dataNode.type !== TypeNodes.notionoauth
    ) {
      return;
    }

    if (!validateForm(props.formData)) return;
    setDisabledButtonTest(true);
    try {
      const result = await executeRequest(
        async signal => {
          return await sendFormData(
            props.formData,
            props.dataNode as Record<string, ModalCredentialData>,
            signal,
          );
        },
        {
          onSuccess: () => {
            console.log("ok");
          },
          onError: error => {
            console.error("Error Testing:", error);
            props.showAlert("Error testing credential", COLOR_ALERTS.failure);
          },
          onFinally: () => {
            // setDisabledButtonTest(false);
          },
        },
      );

      if (!result) {
        setDisabledButtonTest(false);
        console.error("Error Testing:", JSON.stringify(result));
        props.showAlert("Error testing", COLOR_ALERTS.failure);
        return;
      }

      const [isOk, dataResponse] = result as [boolean, ResponseSaveFormData];
      if (!isOk) {
        setDisabledButtonTest(false);
        props.showAlert("Cannot connect", COLOR_ALERTS.failure);
        return;
      }

      if (dataResponse.data === "") {
        setDisabledButtonTest(false);
        console.error("Error Testing:", JSON.stringify(result));
        props.showAlert("Error testing", COLOR_ALERTS.failure);
        return;
      }

      await startPolling(dataResponse.data, props.dataNode.type);
      setDisabledButtonTest(false);
      return;
    } catch (error: any) {
      setDisabledButtonTest(false);
      if (error.name === "AbortError") {
        return console.log("canceled");
      }
      console.error("Error Testing:", error);
      return props.showAlert("Error testing", COLOR_ALERTS.failure);
    }
  }

  async function sendFormData(
    formData: FormData,
    node: Record<string, ModalCredentialData>,
    signal: AbortSignal | undefined,
  ): Promise<[boolean, ResponseSaveFormData]> {
    try {
      const [ok, uriFrontend] = getUriFrontend("/actions/notion");
      if (!ok) {
        return [false, failConnection];
      }
      const body: FormData = createBodySendFormData(formData, node);
      const response = await fetch(uriFrontend, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        body: JSON.stringify(body),
        signal,
      });
      // TODO: token expiration
      if (response.status === 401) {
        // Token maybe has expired, handle expiration and redirect
        // handleTokenExpiration();
        // navigate('/', { replace: true });
        // return [false, failConnection, undefined];
      }

      if (!response.ok) {
        return [false, failConnection];
      }
      // response is id to polling
      const data: ResponseSaveFormData = await response.json();
      if (!data || data.status !== 200) {
        return [false, failConnection];
      }
      return [true, data];
    } catch (error) {
      console.log("error", error);
      return [false, failConnection];
    }
  }

  function createBodySendFormData(
    formData: FormData,
    node: Record<string, ModalCredentialData>,
  ): FormData {
    return {
      pollmode: formData.pollmode,
      selectdocument: formData.selectdocument,
      document: formData.document,
      selectsheet: "",
      sheet: "",
      operation: formData.operation,
      credentialid: node.credential.id,
      sub: node.credential.sub,
      type: node.credential.type,
      workflowid: node.credential.workflowid,
      nodeid: node.credential.nodeid,
      redirecturl: node.credential.data.redirectURL,
      testmode: true,
    };
  }

  function validateForm(formdata: FormData): boolean {
    if (formdata.credentialid === "" || formdata.credentialid === "none") {
      props.showAlert("Select valid credential", COLOR_ALERTS.failure);
      return false;
    }

    if (formdata.document.trim() === "") {
      props.showAlert(ERRORTEXT.notvalidurl, COLOR_ALERTS.failure);
      return false;
    }

    if (formdata.document.trim() !== "") {
      try {
        if (!URL.canParse(formdata.document)) {
          props.showAlert(ERRORTEXT.notvalidurl, COLOR_ALERTS.failure);
          return false;
        }
      } catch (error) {
        console.log("error", error);
        props.showAlert(ERRORTEXT.notvalidurl, COLOR_ALERTS.failure);
        return false;
      }
    }

    if (
      formdata.selectdocument !== "byuri" &&
      formdata.selectdocument !== "byothers"
    ) {
      props.showAlert(ERRORTEXT.notvalidoptiondocument, COLOR_ALERTS.failure);
      return false;
    }

    return true;
  }

  async function startPolling(actionID: string, type: string) {
    if (actionID === "") return;

    let abortController = new AbortController();

    for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const success = await pollingActionTest(
          actionID,
          type,
          abortController.signal,
        );
        if (success) {
          return;
        }
      } catch (error) {
        console.error("Error: ", error);
      }
      // incremental delay btw maybe not need +random offset
      await new Promise(resolve => setTimeout(resolve, DELAY * attempt));
    }
    // error path
    setDisabledButtonTest(false);
    props.showAlert("Error conection", COLOR_ALERTS.failure);
    abortController.abort();
  }

  async function pollingActionTest(
    actionID: string,
    type: string,
    signal: AbortSignal,
  ): Promise<boolean> {
    try {
      const result = await executeRequest(
        async () => {
          return await pollTest(actionID, type, signal as AbortSignal);
        },
        {
          onSuccess: () => console.log("Request successful."),
          onError: error => console.error("Request error:", error),
          onFinally: () => setDisabledButtonTest(false),
        },
      );

      if (!result) return false;

      const [isOk, dataResponse] = result as [boolean, ResponseSaveFormData];
      if (!isOk || dataResponse.data === "") return false;

      props.handleTest(dataResponse);
      return true;
    } catch (error) {
      console.error("Error in pollingActionTest:", error);
      return false;
    }
  }

  async function pollTest(
    actionID: string,
    type: string,
    signal: AbortSignal,
  ): Promise<[boolean, ResponseSaveFormData]> {
    try {
      const [ok, uriFrontend] = getUriFrontend(
        `/actions/notion/${type}/${userInfo?.profile.sub}/${actionID}`,
      );
      if (!ok) return [false, failConnection];

      // const body = createBodySendFormData(formData, node);
      const response = await fetch(uriFrontend, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        signal,
      });
      // TODO: token expiration
      if (response.status === 401) {
        // Token maybe has expired, handle expiration and redirect
        // handleTokenExpiration();
        // navigate('/', { replace: true });
        // return [false, failConnection, undefined];
      }
      if (!response.ok) return [false, failConnection];

      const data: ResponseSaveFormData = await response.json();
      if (!data || (data.status !== 200 && data.status !== 202))
        return [false, failConnection];

      const values = transformPollingData(data);
      return [true, values];
    } catch (error) {
      console.error("Error in pollTest:", error);
      return [false, failConnection];
    }
  }

  function transformPollingData(
    data: ResponseSaveFormData,
  ): ResponseSaveFormData {
    try {
      if (!data) {
        return {
          status: 500,
          error: "",
          data: "",
        };
      }

      const firstLevelParse = JSON.parse(data.data) as ResponseSaveFormData;
      // TODO: need test for empty value
      if (!firstLevelParse.data) {
        return {
          status: 200,
          error: "",
          data: "",
        };
      }
      const secondLevelParse = JSON.parse(firstLevelParse.data);
      if (!secondLevelParse.values) {
        return {
          status: 200,
          error: "",
          data: firstLevelParse.data,
        };
      }

      return {
        status: 200,
        error: "",
        data: JSON.stringify(secondLevelParse.values),
      };
    } catch (error) {
      console.log("error", error);
      console.error("data transform failed:", error);
      return {
        status: 500,
        error: "transform failed",
        data: "",
      };
    }
  }

  return (
    <>
      <Button
        color="blue"
        type="submit"
        onClick={handleSubmitTest}
        disabled={disabledButtonTest}
      >
        Test
      </Button>
    </>
  );
}
