import React, { useState } from "react";
import { Button, ToggleSwitch } from "flowbite-react";
import { MsgSaved, savedStatus, Workflow } from "../../models/Workflow";

interface ContainerProps {
  workflow: Workflow;
  onUpdate: (updatedFields: Workflow) => void;
  onSave: () => Promise<boolean | undefined>;
}

export default function HeaderWorkflow(props: ContainerProps) {
  const [msgSaved, setMsgSaved] = useState<MsgSaved>({
    classText: "",
    text: "",
  });

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value === "") return;
    const tempWorkflow = {
      ...props.workflow,
      name: event.target.value,
    } satisfies Workflow;
    props.onUpdate(tempWorkflow);
  }

  function handleToggleChange(checked: boolean) {
    const tempWorkflow = {
      ...props.workflow,
      is_active: checked ? 1 : 2,
    } satisfies Workflow;
    props.onUpdate(tempWorkflow);
  }

  async function onSave() {
    const saved = await props.onSave();
    let msgSaved = { text: "Saved!", classText: savedStatus.done };
    if (!saved) {
      msgSaved = { text: "Not Saved!", classText: savedStatus.alert };
    }
    setMsgSaved(msgSaved);
  }

  return (
    <div className="sticky top-0 z-30 flex h-[71px] items-center gap-4 border-b bg-background px-6">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            className="renameworkflowname"
            id="name"
            type="text"
            value={props.workflow.name}
            onChange={handleNameChange}
            placeholder="Enter workflow name"
          />
        </div>
        <div className="flex items-center space-x-4">
          <span>Only save when you press the SAVE button</span>
          <span className={msgSaved.classText}>{msgSaved.text}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="is_active"
              className="text-sm text-gray-400 select-none"
            >
              Active
            </label>
            <ToggleSwitch
              id="is_active"
              checked={props.workflow.is_active === 1}
              onChange={handleToggleChange}
            />
          </div>
          <Button disabled size="sm" className="text-gray-400 border-gray-700">
            Share
          </Button>
          <Button onClick={onSave} size="sm" autoFocus={false}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
