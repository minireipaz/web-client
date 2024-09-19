import { Drawer } from "flowbite-react";
import { NodeData } from "./DetailWorkflow";

interface ContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: (event: any, nodeData: NodeData) => void;
}

export function WorkflowDrawer(props: ContainerProps) {
  const DefaultNode = ({ type, label }: { type: string; label: string }) => (
    <button
      className="w-52 border border-gray-300 rounded p-2 mb-2 bg-white text-black select-none"
      draggable={false}
      onClick={(event: any) => {
        const nodeData: NodeData = { type, label };
        props.onClick(event, nodeData);
      }}
    >
      {label}
    </button>
  );

  return(
    <>
      <Drawer open={props.isOpen} onClose={props.onClose} position="right">
        <Drawer.Header title="Nodos Template" className="select-none" />
        <Drawer.Items>
          <div className='ml-4 flex flex-col items-start justify-start'>
            <h2 className="text-lg font-bold mb-4 select-none text-black">Popular</h2>
            <DefaultNode type="input" label="Nodo Input" />
            <DefaultNode type="default" label="Nodo Default" />
            <DefaultNode type="output" label="Nodo Output" />
          </div>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
