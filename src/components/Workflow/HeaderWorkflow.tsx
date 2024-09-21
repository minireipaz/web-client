import { Button, ToggleSwitch } from "flowbite-react";
import { Workflow } from "../../models/Dashboard";
import { useState } from "react";

interface ContainerProps {
  workflow: Workflow
}

export default function HeaderWorkflow(props: ContainerProps) {
  const [swithIsActive, setSwithIsActive] = useState(props.workflow.is_active === 1);
  return (
    <div className="sticky top-0 z-30 flex h-[71px] items-center gap-4 border-b bg-background px-6" >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input className="renameworkflowname" id="name" type="text" defaultValue={props.workflow.name} placeholder="Enter workflow name" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="is_active" className="text-sm text-gray-400 select-none">Active</label>
            <ToggleSwitch id="is_active" checked={swithIsActive} onChange={setSwithIsActive} />
          </div>
          <Button disabled size="sm" className="text-gray-400 border-gray-700">
            Share
          </Button>
          <Button size="sm">Save</Button>
        </div>
      </div>
    </div>
  )
}
