import { useState, useCallback, useEffect, useMemo } from 'react';
import { memo } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  useReactFlow,
  ReactFlowJsonObject
} from '@xyflow/react';
import { edgeTypes, MsgSaved, NodeData, nodeTypes, offsetBottom, offsetRight, ResponseUpdateWorkflow, savedStatus, Workflow } from '../../models/Workflow';
import '@xyflow/react/dist/style.css';
import { WorkflowDrawer } from './WorkflowDrawer';
import HeaderWorkflow from './HeaderWorkflow';
import { getUriFrontend } from '../../utils/getUriFrontend';
import { useAuth } from '../AuthProvider/indexAuthProvider';
import { WorkflowModal } from '../WorkflowModal/Modal';
import { ModalCredentialData } from '../../models/Credential';
// import { ModalCredentialData } from '../Credentials/ModalCredential';

interface ContainerProps {
  workflow: Workflow;
  credentials: ModalCredentialData[];
}

export const DetailWorkflow = memo(function DetailWorkflow(props: ContainerProps) {
  const [workflow, setWorkflow] = useState(props.workflow);
  const [listCredentials, setListCredentials] = useState(props.credentials);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();
  const [lastNodeID, setLastNodeID] = useState("");
  const [rfInstance, setRfInstance] = useState(null);
  const [msgSaved, setMsgSaved] = useState<MsgSaved>({ text: "" });
  const [customDataNode, setCustomDataNode] = useState<Node>();
  const { userInfo } = useAuth();

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleClickFromNode = useCallback((posX: number, posY: number, nodeID: string) => {
    setIsDrawerOpen(true);
    setLastNodeID(nodeID);
    setClickPosition({ x: posX, y: posY });
  }, []);

  useEffect(() => {
    if (props.workflow && props.workflow.nodes) {
      const transformedNodes = transformNodes(props.workflow.nodes);
      setNodes(transformedNodes);
      setEdges(props.workflow.edges || []);
      setListCredentials(props.credentials);
    }
  }, [props.workflow, flowToScreenPosition, handleClickFromNode]);

  function transformNodes(currentNodes: Node[]) {
    const transformedNodes = [];
    for (const node of currentNodes) {
      const posX = node.position.x + 200;
      const posY = node.position.y;

      transformedNodes.push({
        ...node,
        data: {
          ...node.data,
          onClickFromNode: () => {
            handleClickFromNode(
              flowToScreenPosition({ x: posX, y: posY }).x,
              flowToScreenPosition({ x: posX, y: posY }).y,
              node.id
            );
          },
        },
      });
    }
    return transformedNodes;
  }

  const onConnect = useCallback(
    function (params: Connection) {
      setEdges(function (eds) {
        return addEdge({ ...params, type: 'buttonedge', animated: true, style: { stroke: '#fff' } }, eds);
      });
    },
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event: any, connectionState: any) => {
      if (!connectionState.isValid) {
        setLastNodeID(connectionState.fromNode.id);
        let { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        clientX += offsetRight;
        clientY += offsetBottom;
        setClickPosition({ x: clientX, y: clientY });
        setIsDrawerOpen(true);
      }
    }, [screenToFlowPosition]
  )

  const handleClickDrawer = useCallback((event: any, nodeData: NodeData) => {
    event.preventDefault();
    const position = screenToFlowPosition({
      x: clickPosition.x,
      y: clickPosition.y,
    });
    const nodeID = `${nodeData.type}-${nodes.length + 1}`;
    const newNode: Node = {
      id: nodeID,
      type: 'wrapperNode', // type for reactflow
      position,
      data: {
        id: nodeID,
        label: nodeData.label,
        type: nodeData.type,
        options: nodeData.options || 'Default Options',
        description: nodeData.description || 'Default Description',
        onClickFromNode: (posX: number, posY: number, nodeID: string) => {
          handleClickFromNode(posX, posY, nodeID);
        },
        workflowid: workflow.id,
        nodeid: nodeID,
        credential: {},
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) =>
      eds.concat({ id: nodeID, source: lastNodeID, target: nodeID, type: 'buttonedge', animated: true, style: { stroke: '#fff' } }),
    );
    setIsDrawerOpen(false);
  }, [clickPosition, nodes, lastNodeID, screenToFlowPosition, flowToScreenPosition, handleClickFromNode]);

  const handleWorkflowUpdate = useCallback((updatedFields: Workflow) => {
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      ...updatedFields
    }));
  }, []);

  const handleSaveWorkflow = useCallback(async () => {
    if (!rfInstance) return;

    // @ts-ignore ts(2339)
    const flowJSON = rfInstance.toObject() as ReactFlowJsonObject;
    const currentWorkflow = { ...workflow, ...flowJSON };
    const updated = await sendChangedWorkflow(currentWorkflow);
    if (!updated) {
      setMsgSaved({ text: "Not Saved!", classText: savedStatus.alert });
    } else {
      setMsgSaved({ text: "Saved", classText: savedStatus.done });
    }
    setTimeout(() => {
      setMsgSaved({ text: "", classText: savedStatus.none });
    }, 5000);
    setWorkflow({ ...currentWorkflow });
    console.log('Saving workflow:', currentWorkflow);

  }, [rfInstance, workflow]);

  async function handleUpdateNodes(newDataForNode: ModalCredentialData) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === newDataForNode.nodeid) {
        nodes[i].data.credential = {
          id: newDataForNode.id,
          sub: workflow.user_id,
          name: newDataForNode.name,
          workflowid: nodes[i].data.workflowid,
          nodeid: nodes[i].data.nodeid,
          type: newDataForNode.type,
          data: { ...newDataForNode.data }
        };
      }
    }
    setNodes(nodes);
    await handleSaveWorkflow();
  }

  async function sendChangedWorkflow(currentWorkflow: Workflow) {
    try {
      const [ok, uriFrontend] = getUriFrontend(`/api/workflows/${currentWorkflow.id}`);
      if (!ok) {
        return false;
      }

      currentWorkflow.user_id = userInfo?.profile.sub;
      currentWorkflow.access_token = userInfo?.access_token;
      currentWorkflow.status = Number.parseInt(currentWorkflow.status.toString()) || 1;
      console.log(JSON.stringify({
        user_id: userInfo?.profile.sub,
        access_token: userInfo?.access_token,
        data: currentWorkflow
      }));
      const response = await fetch(uriFrontend, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo?.access_token}`,
        },
        body: JSON.stringify({
          user_id: userInfo?.profile.sub,
          access_token: userInfo?.access_token,
          data: currentWorkflow
        }),
      });

      if (!response.ok) {
        // TODO: better redirect
        return false;
      }

      const data: ResponseUpdateWorkflow = await response.json();
      console.log("updated Workflow response:", JSON.stringify(data));
      if (data.error !== "") {
        return false;
      }
      if (data.status !== 200) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error registering user in backend:", error);
      return false;
    }
    return false;
  }

  const onDoubleClickNode = useCallback(async (_: React.MouseEvent, node: Node) => {
    console.log("node" + JSON.stringify(node));
    setCustomDataNode(node);
    setIsOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const memoizedControls = useMemo(() => <Controls />, []);
  const memoizedBackground = useMemo(() => (
    <Background color="#ffffff4f" variant={BackgroundVariant.Dots} gap={6} size={1} />
  ), []);

  return (
    <>
      <div className="flex flex-col">
        <HeaderWorkflow
          workflow={workflow}
          onUpdate={handleWorkflowUpdate}
          onSave={handleSaveWorkflow}
          msgSaved={msgSaved}
        />
        <div className="h-full w-full relative">
          <ReactFlow
            onInit={setRfInstance as any}
            nodes={nodes}
            edges={edges}
            onNodeDoubleClick={onDoubleClickNode}
            onConnectEnd={onConnectEnd}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView={true}
            minZoom={0}
            maxZoom={1}
            colorMode='dark'
            nodeOrigin={[2, 0]}
          >
            {memoizedControls}
            {memoizedBackground}
          </ReactFlow>
          <div className='absolute w-16 h-32 top-0 right-0 flex flex-col z-50'>
            <div className='absolute top-4 right-4'>
              <button className="flex items-center justify-center bg-[#141414] h-12 w-12 top-0 right-0 border-white border border-solid hover:border-red-300 hover:text-red-300 "
                onClick={() => setIsDrawerOpen(true)}>
                <span className="font-semibold text-4xl ">+</span>
              </button>
            </div>
            <WorkflowDrawer
              isOpen={isDrawerOpen}
              onClose={closeDrawer}
              onClick={handleClickDrawer}
            />
            <WorkflowModal onSave={handleUpdateNodes} isOpen={isOpenModal} onClose={handleCloseModal} dataNode={customDataNode as Node} credentials={listCredentials} />
          </div>
        </div>
      </div>
    </>
  );
});

