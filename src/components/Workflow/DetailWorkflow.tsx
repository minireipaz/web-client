import { useState, useCallback, useMemo, useRef } from 'react';
import { memo } from 'react';
import {
  ReactFlow,
  addEdge,
  // useNodesState,
  // useEdgesState,
  Node,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  useReactFlow,
  ReactFlowJsonObject,
  NodeOrigin,
  applyNodeChanges,
  applyEdgeChanges,
  // NodeChange,
} from '@xyflow/react';
import {
  edgeTypes,
  MsgSaved,
  NodeData,
  nodeTypes,
  offsetBottom,
  offsetRight,
  ResponseUpdateWorkflow,
  savedStatus,
  Workflow,
} from '../../models/Workflow';
import '@xyflow/react/dist/style.css';
import { WorkflowDrawer } from './WorkflowDrawer';
import HeaderWorkflow from './HeaderWorkflow';
import { getUriFrontend } from '../../utils/getUriFrontend';
import { useAuth } from '../AuthProvider/indexAuthProvider';
import { WorkflowModal } from '../WorkflowModal/Modal';
import { ModalCredentialData } from '../../models/Credential';
import { FormData } from '../../models/Workflow';

interface ContainerProps {
  workflow: Workflow;
  credentials: ModalCredentialData[];
}

export const DetailWorkflow = memo(function DetailWorkflow(
  props: ContainerProps
) {
  const transformedNodes = useMemo(() => {
    if (props.workflow && props.workflow.nodes) {
      return transformNodes(props.workflow.nodes);
    }
    return [];
  }, [props.workflow]);

  const [workflow, setWorkflow] = useState(props.workflow);
  // const [listCredentials, setListCredentials] = useState(props.credentials);
  // const [nodes, setNodes] = useNodesState<Node>(transformedNodes);
  const [nodes, setNodes] = useState<Node[]>(transformedNodes);
  const nodesDataRef = useRef(nodes);
  nodesDataRef.current = nodes;

  // const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
  //   props.workflow?.edges || []
  // );

  const [edges, setEdges] = useState<Edge[]>(
    props.workflow?.edges || []
  );


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();
  const [lastNodeID, setLastNodeID] = useState('');
  const [rfInstance, setRfInstance] = useState(null);
  const [msgSaved, setMsgSaved] = useState<MsgSaved>({ text: '' });
  const [customDataNode, setCustomDataNode] = useState<Node>();
  const { userInfo } = useAuth();
  const nodeOrigin: NodeOrigin = useMemo(() => [2, 0], []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleClickFromNode = useCallback(
    (posX: number, posY: number, nodeID: string) => {
      setIsDrawerOpen(true);
      setLastNodeID(nodeID);
      setClickPosition({ x: posX, y: posY });
    },
    []
  );

  function transformNodes(currentNodes: Node[]) {
    return currentNodes.map((node) => {
      const posX = node.position.x + 200;
      const posY = node.position.y;

      return {
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
      };
    });
  }

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: 'buttonedge',
          animated: true,
          style: { stroke: '#fff' },
        },
        eds
      )
    );
  }, []);

  const onConnectEnd = useCallback((event: any, connectionState: any) => {
    if (!connectionState.isValid) {
      setLastNodeID(connectionState.fromNode.id);
      let { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event;
      clientX += offsetRight;
      clientY += offsetBottom;
      setClickPosition({ x: clientX, y: clientY });
      setIsDrawerOpen(true);
    }
  }, []);

  const handleClickDrawer = useCallback(
    (event: any, nodeData: NodeData) => {
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
          formdata: {
            // default values from
            pollmode: 'none',
            selectdocument: 'byuri',
            document: '',
            selectsheet: 'byname',
            sheet: '',
            operation: 'getallcontent',
          },
        },
      };
      // nodesDataRef.current.push(newNode);
      setNodes((prevNodes) => [...prevNodes, newNode]);
      setEdges((prevEdges) => [
        ...prevEdges,
        {
          id: nodeID,
          source: lastNodeID,
          target: nodeID,
          type: 'buttonedge',
          animated: true,
          style: { stroke: '#fff' },
        },
      ]);
      setIsDrawerOpen(false);
    },
    [
      clickPosition,
      nodes.length,
      lastNodeID,
      screenToFlowPosition,
      handleClickFromNode,
    ]
  );

  const handleWorkflowUpdate = useCallback((updatedFields: Workflow) => {
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      ...updatedFields,
    }));
  }, []);

  const handleSaveWorkflow = useCallback(async () => {
    if (!rfInstance) return;

    // @ts-ignore ts(2339)
    const flowJSON = rfInstance.toObject() as ReactFlowJsonObject;
    const currentWorkflow = { ...workflow, ...flowJSON };
    const updated = await sendChangedWorkflow(currentWorkflow);
    if (!updated) {
      setMsgSaved({ text: 'Not Saved!', classText: savedStatus.alert });
    } else {
      setMsgSaved({ text: 'Saved', classText: savedStatus.done });
    }
    setTimeout(() => {
      setMsgSaved({ text: '', classText: savedStatus.none });
    }, 5000);
    setWorkflow({ ...currentWorkflow });
    console.log('Saving workflow:', currentWorkflow);
  }, [rfInstance, workflow]);

  async function sendChangedWorkflow(currentWorkflow: Workflow) {
    try {
      const [ok, uriFrontend] = getUriFrontend(
        `/api/v1/workflows/${userInfo?.profile.sub}/${currentWorkflow.id}`
      );
      if (!ok) {
        return false;
      }

      currentWorkflow.user_id = userInfo?.profile.sub;
      currentWorkflow.access_token = userInfo?.access_token;
      currentWorkflow.status =
        Number.parseInt(currentWorkflow.status.toString()) || 1;

      const response = await fetch(uriFrontend, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        body: JSON.stringify({
          user_id: userInfo?.profile.sub,
          access_token: userInfo?.access_token,
          data: currentWorkflow,
        }),
      });

      if (response.status === 401) {
        // Token maybe has expired, handle expiration and redirect
        // handleTokenExpiration();
        // navigate('/', { replace: true });
        // return [false, failConnection, undefined];
      }

      if (!response.ok) {
        // TODO: better redirect
        return false;
      }

      const data: ResponseUpdateWorkflow = await response.json();
      console.log('updated Workflow response:', JSON.stringify(data));
      if (data.error !== '') {
        return false;
      }
      return data.status === 200;
    } catch (error) {
      console.error('Error registering user in backend:', error);
      return false;
    }
    return false;
  }

  const handleUpdateNodes = useCallback(
    async (newDataForNode: ModalCredentialData) => {
      // updating node from Nodes without re-rendering
      // for testing performance
      for (let i = 0; i < nodesDataRef.current.length; i++) {
        if (nodesDataRef.current[i].id === newDataForNode.nodeid) {
          nodesDataRef.current[i].data = {
            ...nodesDataRef.current[i].data,
            credential: {
              id: newDataForNode.id,
              sub: workflow.user_id,
              name: newDataForNode.name,
              workflowid: nodesDataRef.current[i].data.workflowid,
              nodeid: nodesDataRef.current[i].data.nodeid,
              type: newDataForNode.type,
              data: { ...newDataForNode.data },
            },
          }
          setCustomDataNode(nodesDataRef.current[i])
        }
      }

      // setNodes((prevNodes) =>
      //   prevNodes.map((node) => {
      //     if (node.id === newDataForNode.nodeid) {
      //       return {
      //         ...node,
      //         data: {
      //           ...node.data,
      //           credential: {
      //             id: newDataForNode.id,
      //             sub: workflow.user_id,
      //             name: newDataForNode.name,
      //             workflowid: node.data.workflowid,
      //             nodeid: node.data.nodeid,
      //             type: newDataForNode.type,
      //             data: { ...newDataForNode.data },
      //           },
      //         },
      //       };
      //     }
      //     return node;
      //   })
      // );
    },
    [workflow.user_id, handleSaveWorkflow]
  );

  const onDoubleClickNode = useCallback(
    async (_: React.MouseEvent, node: Node) => {
      console.log('node' + JSON.stringify(node));
      setCustomDataNode(node);
      setIsOpenModal(true);
    },
    []
  );

  function updateNodeByNodeID(currentNodes: Node[], currentNode: Node): Node[] {
    for (let i = 0; i < currentNodes.length; i++) {
      if (currentNodes[i].data.nodeid === currentNode.data.nodeid) {
        currentNodes[i].data = {
          ...currentNodes[i].data,
          ...currentNode.data,
        };
      }
    }
    return [...currentNodes];
  }

  const onNodeChange = useCallback(
    (changes: any) => {
      console.log("changeing")
      setNodes((eds) => applyNodeChanges(changes, eds));
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [edges]
  );

  const handleSaveModal = useCallback(
    async (formData: FormData, dataNode: Node) => {
      // update listcredentials ?
      //


      const currentNode = {
        ...dataNode,
        data: {
          ...dataNode.data,
          formdata: {
            ...formData,
          },
        },
      } as Node;
      setCustomDataNode(currentNode);
      const nodesUpdated = updateNodeByNodeID(nodes, currentNode);
      nodesDataRef.current = nodesUpdated;
      // setNodes(nodesUpdated);
      await handleSaveWorkflow();
    },
    [nodes]
  );

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  // const memoizedListCredentials = useMemo(
  //   () => listCredentials,
  //   [listCredentials]
  // );
  const memoizedDataNode = useMemo(() => customDataNode, [customDataNode]);
  const memoizedControls = useMemo(() => <Controls />, []);
  const memoizedBackground = useMemo(
    () => (
      <Background
        color="#ffffff4f"
        variant={BackgroundVariant.Dots}
        gap={6}
        size={1}
      />
    ),
    []
  );

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
            onNodesChange={onNodeChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView={true}
            minZoom={0}
            maxZoom={1}
            colorMode="dark"
            nodeOrigin={nodeOrigin}
          >
            {memoizedControls}
            {memoizedBackground}
          </ReactFlow>
          <div className="absolute w-16 h-32 top-0 right-0 flex flex-col z-50">
            <div className="absolute top-4 right-4">
              <button
                className="flex items-center justify-center bg-[#141414] h-12 w-12 top-0 right-0 border-white border border-solid hover:border-red-300 hover:text-red-300 "
                onClick={() => setIsDrawerOpen(true)}
              >
                <span className="font-semibold text-4xl ">+</span>
              </button>
            </div>
            <WorkflowDrawer
              isOpen={isDrawerOpen}
              onClose={closeDrawer}
              onClick={handleClickDrawer}
            />
            <WorkflowModal
              onUpdateNode={handleUpdateNodes}
              onSaveModal={handleSaveModal}
              isOpen={isOpenModal}
              onClose={handleCloseModal}
              // dataNode={nodesDataRef.current}
              dataNode={memoizedDataNode as Node}
              credentials={props.credentials} // listcredentials
            />
          </div>
        </div>
      </div>
    </>
  );
});
