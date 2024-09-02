import { Button, Modal, TextInput, Label, Select } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider/indexAuthProvider";
import { ResponseGenerateWorkflow, Workflow } from "../../models/QuickActions";
import { getUriFrontend } from "../../utils/getUriFrontend";


export function QuickActions() {
  const [openModal, setOpenModal] = useState(false);
  const [workflow, setWorkflow] = useState<Workflow>({
    workflowname: "",
    directorytosave: "home",
    uuid: "",
    sub: "",
    createdat: "",
    updatedat: ""
  });
  const [errorTitle, setErrorTitle] = useState<string>("");
  const [disabledButtonCreateWorkflow, setDisabledButtonCreateWorkflow] = useState(false);

  const failConnection: ResponseGenerateWorkflow = {
    error: "Conexion error",
    status: 500,
  }

  const navigate = useNavigate();
  const { userInfo } = useAuth();

  function onChangeWorkflowName(event: any) {
    setWorkflow({
      workflowname: event.target.value,
      description: workflow.description,
      directorytosave: workflow.directorytosave,
    });
  }


  function onChangeWorkflowDescription(event: any) {
    setWorkflow({
      workflowname: workflow.workflowname,
      description: event.target.value,
      directorytosave: workflow.directorytosave,
    });
  }


  async function onClickCreateWorkflow() {
    if (!checkValidations(workflow)) return;

    try {
      setDisabledButtonCreateWorkflow(true);
      const [isOk, data] = await newWorkflow(workflow);
      setDisabledButtonCreateWorkflow(false);
      if (!isOk) {
        if (data.error) {
          return showAlert(data.error);
        }
        setErrorTitle("Cannot connect")
        return showAlert("Cannot connect");
      }
      setErrorTitle("")
      closeModal();
      navigate(`/workflow/${data?.workflow?.uuid}`, { state: { workflow: data } });

    } catch (error) {
      console.error("Error creating workflow:", error);
      return showAlert("Error creating workflow");
    }

  }

  function checkValidations(workflow: Workflow) {
    if (workflow.workflowname.trim() === "") {
      showAlert("Workflow name is required");
      return false;
    }

    if (workflow.workflowname.length < 3 || workflow.workflowname.length > 50) {
      showAlert("Workflow name must be between 3 and 50 characters");
      return false;
    }

    if (workflow.directorytosave.trim() === "") {
      showAlert("Directory to save is required");
      return false;
    }
    return true;
  }

  async function newWorkflow(workflow: Workflow): Promise<[boolean, ResponseGenerateWorkflow]> {
    try {
      const body: Workflow = {
        workflowname: workflow.workflowname,
        description: workflow.description,
        directorytosave: workflow.directorytosave,
        sub: userInfo?.profile.sub,
      };

      const [ok, uriFrontend] = getUriFrontend("/api/workflows");
      if (!ok) {
        return [false, failConnection];
      }
      const response = await fetch(`${uriFrontend}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo?.access_token}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      console.log("JSON=>" + JSON.stringify(response))
      const data: ResponseGenerateWorkflow = await response.json();
      if (!data) {
        return [false, data]
      }
      if (data.status !== 200 && data.status !== 201) {
        return [false, data]
      }
      return [true, data];
    } catch (error) {
      console.error("Error creating workflow:", error);
      return [false, failConnection];
    }
  }

  function showAlert(title: string) {
    console.error("Alert title ", title);
  }

  function closeModal() {
    setWorkflow({
      workflowname: "",
      directorytosave: "home"
    });
    setOpenModal(false);
  }

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
        <div className="flex flex-col space-y-1.5 p-6" >
          <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight" >Quick Actions</h3>
        </div>
        <div className="p-6 grid gap-2" >
          <button onClick={() => setOpenModal(true)} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            Create New Workflow
          </button>
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
            Upload File</button>
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            Download Report
          </button>
        </div>
      </div>
      <Modal show={openModal} onClose={closeModal}>
        <Modal.Header>Create Workflow</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-y-8 mt-1 mb-1">
            <div className="flex flex-col gap-y-1">
              <Label className="text-black">Workflow Name</Label>
              <TextInput
                id="workflow_name"
                placeholder="Name of the workflow."
                value={workflow.workflowname}
                onChange={onChangeWorkflowName}
                required
              />
              <p className="text-xs text-black ">Enter the name of the workflow.</p>
            </div>
            <div className="flex flex-col gap-y-1">
              <Label className="text-black">Workflow Description</Label>
              <TextInput
                id="description"
                placeholder="Description of the workflow."
                value={workflow.description}
                onChange={onChangeWorkflowDescription}
                required
              />
              <p className="text-xs text-black ">Enter description of the workflow.</p>
            </div>
            <div className=" flex flex-col gap-y-1 ">
              <Label className=" text-black">Select Folder</Label>
              <div className="dropdown bootstrap-select form-control">
                <Select id="create_workflow_select_folder_id" className="w-full" title="Select Folder">
                  <option defaultValue={"home"} value="home">Home</option>
                </Select>
              </div>
              <p className="text-black text-xs m-b-0 m-t-5 p-t-1">Select the folder or subfolder where you want to create the workflow.</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-row justify-between items-center w-full">
            <Button color="gray" onClick={closeModal}>Close</Button>
            <div className="text-black text-xs">{errorTitle}</div>
            <Button onClick={onClickCreateWorkflow} disabled={disabledButtonCreateWorkflow}>Create</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
