import { Drawer } from 'flowbite-react';
import { NodeData } from '../../models/Workflow';

interface ContainerProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: (event: any, nodeData: NodeData) => void;
}

export const TypeNodes = {
  googlesheets: 'googlesheets',
  notionoauth: 'notionoauth',
  notiontoken: "notiontoken"
};

export function WorkflowDrawer(props: ContainerProps) {
  const DefaultNode = (node: NodeData) => (
    <button
      key={node.id}
      id={node.id}
      className="w-52 border border-gray-300 rounded p-2 mb-2 bg-white text-black select-none"
      draggable={false}
      onClick={(event: any) => {
        const nodeData: NodeData = { ...node };
        props.onClick(event, nodeData);
      }}
    >
      {node.label}
    </button>
  );
  // hardcoded ListDefaultNodeS
  return (
    <>
      <Drawer open={props.isOpen} onClose={props.onClose} position="right">
        <Drawer.Header title="Nodos Template" className="select-none" />
        <Drawer.Items>
          <div className="ml-4 flex flex-col items-start justify-start">
            <h2 className="text-lg font-bold mb-4 select-none text-black">
              Popular
            </h2>
            <DefaultNode
              id="googlesheets" // new ids?
              description="Google Sheets bla bla bla"
              options="optin1"
              type={TypeNodes.googlesheets}
              label="Google Sheets"
              formdata={{
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
              }}
            />
            <DefaultNode
              id="notiongetdatabase"
              description="Notion Get Database"
              options="optin2"
              type={TypeNodes.notiontoken}
              label="Notion Get Database"
              formdata={{
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
              }}
            />
            <DefaultNode
              id="id3"
              description="node output"
              options="optin3"
              type="output"
              label="Notion Update Database"
              formdata={{
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
              }}
            />
          </div>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
