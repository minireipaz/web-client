import React from 'react';
import { Button, ToggleSwitch } from "flowbite-react";
import { Workflow } from "../../models/Workflow";

interface ContainerProps {
  workflow: Workflow;
  onUpdate: (updatedFields: Workflow) => void;
  onSave: () => void;
}

export default function HeaderWorkflow({ workflow, onUpdate, onSave }: ContainerProps) {
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") return;
    const tempWorkflow = {...workflow, name: event.target.value } satisfies Workflow;
    onUpdate(tempWorkflow);
  };

  const handleToggleChange = (checked: boolean) => {
    const tempWorkflow = { ...workflow, is_active: checked ? 1 : 2 } satisfies Workflow;
    onUpdate(tempWorkflow);
  };

  return (
    <div className="sticky top-0 z-30 flex h-[71px] items-center gap-4 border-b bg-background px-6">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            className="renameworkflowname"
            id="name"
            type="text"
            value={workflow.name}
            onChange={handleNameChange}
            placeholder="Enter workflow name"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="is_active" className="text-sm text-gray-400 select-none">Active</label>
            <ToggleSwitch
              id="is_active"
              checked={workflow.is_active === 1}
              onChange={handleToggleChange}
            />
          </div>
          <Button disabled size="sm" className="text-gray-400 border-gray-700">
            Share
          </Button>
          <Button onClick={onSave} size="sm">Save</Button>
        </div>
      </div>
    </div>
  );
}
